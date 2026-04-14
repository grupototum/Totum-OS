// File: src/agents/core/state-manager.ts
// Purpose: Manage workflow execution state, transitions, and state persistence
// Phase: PASSO 7.2 - Workflow Engine

import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';
import { Logger } from './logger';

type StateValue = string | number | boolean | Record<string, any> | any[];

interface StateSnapshot {
  executionId: string;
  version: number;
  timestamp: Date;
  state: Map<string, StateValue>;
  previousState?: Map<string, StateValue>;
  changes: Map<string, { oldValue: StateValue; newValue: StateValue }>;
}

interface StateTransition {
  from: string;
  to: string;
  condition?: (state: Map<string, StateValue>) => boolean;
  onTransition?: () => Promise<void>;
}

interface StateValidator {
  key: string;
  validate: (value: StateValue) => boolean;
  errorMessage: string;
}

class StateManager {
  private supabase: any;
  private redis: Redis;
  private logger: Logger;
  private states: Map<string, Map<string, StateValue>>;
  private snapshots: Map<string, StateSnapshot[]>;
  private transitions: Map<string, StateTransition[]>;
  private validators: Map<string, StateValidator>;
  private lockManager: Map<string, { locked: boolean; owner: string; timeout: NodeJS.Timeout }>;
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly REDIS_PREFIX = 'state:';
  private readonly MAX_SNAPSHOTS = 100;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    logger: Logger,
    redisUrl: string = 'redis://localhost:6379'
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.redis = new Redis(redisUrl);
    this.logger = logger;
    this.states = new Map();
    this.snapshots = new Map();
    this.transitions = new Map();
    this.validators = new Map();
    this.lockManager = new Map();
  }

  /**
   * Initialize state for an execution
   */
  async initializeState(executionId: string, initialState?: Record<string, StateValue>): Promise<void> {
    if (this.states.has(executionId)) {
      throw new Error(`State already initialized for execution: ${executionId}`);
    }

    const state = new Map<string, StateValue>(Object.entries(initialState || {}));
    this.states.set(executionId, state);

    // Create initial snapshot
    const snapshot: StateSnapshot = {
      executionId,
      version: 0,
      timestamp: new Date(),
      state: new Map(state),
      changes: new Map(),
    };

    this.snapshots.set(executionId, [snapshot]);

    // Persist to database
    await this.persistState(executionId, state);

    this.logger.info(executionId, 'StateManager', 'State initialized', {
      keys: Array.from(state.keys()),
    });
  }

  /**
   * Set state value
   */
  async setState(executionId: string, key: string, value: StateValue): Promise<void> {
    const state = this.getState(executionId);
    if (!state) {
      throw new Error(`State not found for execution: ${executionId}`);
    }

    // Validate value if validator exists
    const validator = this.validators.get(key);
    if (validator && !validator.validate(value)) {
      throw new Error(`State validation failed for ${key}: ${validator.errorMessage}`);
    }

    // Update state
    const oldValue = state.get(key);
    state.set(key, value);

    // Record change
    this.recordChange(executionId, key, oldValue, value);

    // Cache update
    await this.updateRedisCache(executionId);

    this.logger.debug(executionId, 'StateManager', `State updated: ${key}`, {
      oldValue,
      newValue: value,
    });
  }

  /**
   * Get state value
   */
  getStateValue(executionId: string, key: string): StateValue | undefined {
    const state = this.getState(executionId);
    return state?.get(key);
  }

  /**
   * Get entire state
   */
  getState(executionId: string): Map<string, StateValue> | null {
    return this.states.get(executionId) || null;
  }

  /**
   * Update multiple state values
   */
  async updateState(executionId: string, updates: Record<string, StateValue>): Promise<void> {
    for (const [key, value] of Object.entries(updates)) {
      await this.setState(executionId, key, value);
    }

    // Persist to database
    const state = this.getState(executionId);
    if (state) {
      await this.persistState(executionId, state);
    }
  }

  /**
   * Create state snapshot
   */
  async createSnapshot(executionId: string, label?: string): Promise<StateSnapshot> {
    const state = this.getState(executionId);
    if (!state) {
      throw new Error(`State not found for execution: ${executionId}`);
    }

    const snapshots = this.snapshots.get(executionId) || [];
    const version = snapshots.length;

    const snapshot: StateSnapshot = {
      executionId,
      version,
      timestamp: new Date(),
      state: new Map(state),
      previousState: snapshots.length > 0 ? new Map(snapshots[snapshots.length - 1].state) : undefined,
      changes: new Map(),
    };

    snapshots.push(snapshot);

    // Keep only last N snapshots
    if (snapshots.length > this.MAX_SNAPSHOTS) {
      snapshots.shift();
    }

    this.snapshots.set(executionId, snapshots);

    // Persist snapshot
    await this.persistSnapshot(executionId, snapshot, label);

    this.logger.info(executionId, 'StateManager', `Snapshot created (v${version})`, { label });

    return snapshot;
  }

  /**
   * Rollback to previous snapshot
   */
  async rollbackToSnapshot(executionId: string, version: number): Promise<StateSnapshot> {
    const snapshots = this.snapshots.get(executionId);
    if (!snapshots || !snapshots[version]) {
      throw new Error(`Snapshot not found: ${executionId}@${version}`);
    }

    const snapshot = snapshots[version];
    const state = this.getState(executionId);

    if (!state) {
      throw new Error(`State not found for execution: ${executionId}`);
    }

    // Restore state
    state.clear();
    snapshot.state.forEach((value, key) => {
      state.set(key, value);
    });

    // Persist
    await this.persistState(executionId, state);

    this.logger.info(executionId, 'StateManager', `Rolled back to snapshot v${version}`);

    return snapshot;
  }

  /**
   * Get snapshot history
   */
  getSnapshotHistory(executionId: string): StateSnapshot[] {
    return this.snapshots.get(executionId) || [];
  }

  /**
   * Merge state from another execution
   */
  async mergeState(executionId: string, sourceExecutionId: string, keys?: string[]): Promise<void> {
    const state = this.getState(executionId);
    const sourceState = this.getState(sourceExecutionId);

    if (!state || !sourceState) {
      throw new Error('Invalid execution IDs for merge');
    }

    const keysToMerge = keys || Array.from(sourceState.keys());

    for (const key of keysToMerge) {
      const value = sourceState.get(key);
      if (value !== undefined) {
        await this.setState(executionId, key, value);
      }
    }

    this.logger.info(executionId, 'StateManager', `Merged state from ${sourceExecutionId}`, {
      keyCount: keysToMerge.length,
    });
  }

  /**
   * Register state validator
   */
  registerValidator(validator: StateValidator): void {
    this.validators.set(validator.key, validator);
  }

  /**
   * Register state transition
   */
  registerTransition(executionId: string, transition: StateTransition): void {
    if (!this.transitions.has(executionId)) {
      this.transitions.set(executionId, []);
    }

    this.transitions.get(executionId)?.push(transition);
  }

  /**
   * Get available transitions
   */
  getAvailableTransitions(executionId: string, currentState: string): StateTransition[] {
    const transitions = this.transitions.get(executionId) || [];
    const state = this.getState(executionId);

    if (!state) {
      return [];
    }

    return transitions.filter(t => {
      if (t.from !== currentState) return false;
      if (t.condition && !t.condition(state)) return false;
      return true;
    });
  }

  /**
   * Execute state transition
   */
  async executeTransition(
    executionId: string,
    currentState: string,
    targetState: string
  ): Promise<boolean> {
    const transitions = this.getAvailableTransitions(executionId, currentState);
    const transition = transitions.find(t => t.to === targetState);

    if (!transition) {
      this.logger.warn(
        executionId,
        'StateManager',
        `No valid transition: ${currentState} -> ${targetState}`
      );
      return false;
    }

    // Execute transition callback
    if (transition.onTransition) {
      await transition.onTransition();
    }

    // Update state
    await this.setState(executionId, '_state', targetState);

    this.logger.info(executionId, 'StateManager', `Transitioned: ${currentState} -> ${targetState}`);

    return true;
  }

  /**
   * Acquire state lock
   */
  async acquireLock(executionId: string, owner: string, timeoutMs: number = 30000): Promise<boolean> {
    const lock = this.lockManager.get(executionId);

    if (lock && lock.locked && lock.owner !== owner) {
      return false; // Already locked by someone else
    }

    const timeout = setTimeout(() => {
      this.lockManager.delete(executionId);
    }, timeoutMs);

    this.lockManager.set(executionId, {
      locked: true,
      owner,
      timeout,
    });

    return true;
  }

  /**
   * Release state lock
   */
  releaseLock(executionId: string, owner: string): boolean {
    const lock = this.lockManager.get(executionId);

    if (!lock || lock.owner !== owner) {
      return false;
    }

    clearTimeout(lock.timeout);
    this.lockManager.delete(executionId);

    return true;
  }

  /**
   * Get state diff between two versions
   */
  getStateDiff(
    executionId: string,
    fromVersion: number,
    toVersion: number
  ): Map<string, { oldValue: StateValue; newValue: StateValue }> {
    const snapshots = this.snapshots.get(executionId);
    if (!snapshots || !snapshots[fromVersion] || !snapshots[toVersion]) {
      throw new Error(`Invalid snapshot versions: ${fromVersion}-${toVersion}`);
    }

    const fromState = snapshots[fromVersion].state;
    const toState = snapshots[toVersion].state;
    const diff = new Map<string, { oldValue: StateValue; newValue: StateValue }>();

    // Find changed keys
    const allKeys = new Set([...fromState.keys(), ...toState.keys()]);

    for (const key of allKeys) {
      const oldValue = fromState.get(key);
      const newValue = toState.get(key);

      if (oldValue !== newValue) {
        diff.set(key, { oldValue, newValue });
      }
    }

    return diff;
  }

  /**
   * Export state to JSON
   */
  async exportState(executionId: string): Promise<Record<string, StateValue>> {
    const state = this.getState(executionId);
    if (!state) {
      throw new Error(`State not found for execution: ${executionId}`);
    }

    const exported: Record<string, StateValue> = {};
    state.forEach((value, key) => {
      exported[key] = value;
    });

    return exported;
  }

  /**
   * Import state from JSON
   */
  async importState(executionId: string, data: Record<string, StateValue>): Promise<void> {
    await this.initializeState(executionId, data);
  }

  /**
   * Cleanup state for completed execution
   */
  async cleanup(executionId: string): Promise<void> {
    this.states.delete(executionId);
    this.snapshots.delete(executionId);
    this.transitions.delete(executionId);
    this.lockManager.delete(executionId);

    await this.redis.del(`${this.REDIS_PREFIX}${executionId}`);

    this.logger.info(executionId, 'StateManager', 'State cleaned up');
  }

  /**
   * Destroy manager
   */
  async destroy(): Promise<void> {
    this.states.clear();
    this.snapshots.clear();
    this.transitions.clear();
    this.validators.clear();
    this.lockManager.forEach(lock => clearTimeout(lock.timeout));
    this.lockManager.clear();

    await this.redis.quit();
  }

  // Private helper methods

  private recordChange(
    executionId: string,
    key: string,
    oldValue: StateValue | undefined,
    newValue: StateValue
  ): void {
    const snapshots = this.snapshots.get(executionId);
    if (snapshots && snapshots.length > 0) {
      const lastSnapshot = snapshots[snapshots.length - 1];
      lastSnapshot.changes.set(key, { oldValue, newValue });
    }
  }

  private async updateRedisCache(executionId: string): Promise<void> {
    try {
      const state = this.getState(executionId);
      if (!state) return;

      const data = Object.fromEntries(state);
      await this.redis.setex(
        `${this.REDIS_PREFIX}${executionId}`,
        this.CACHE_TTL,
        JSON.stringify(data)
      );
    } catch (error) {
      this.logger.error(executionId, 'StateManager', 'Redis cache update failed', {
        error: (error as Error).message,
      });
    }
  }

  private async persistState(executionId: string, state: Map<string, StateValue>): Promise<void> {
    try {
      const data = Object.fromEntries(state);

      const { error } = await this.supabase
        .from('execution_states')
        .upsert({
          execution_id: executionId,
          state: JSON.stringify(data),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        this.logger.error(executionId, 'StateManager', 'Failed to persist state', {
          error: error.message,
        });
      }
    } catch (error) {
      this.logger.error(executionId, 'StateManager', 'State persistence failed', {
        error: (error as Error).message,
      });
    }
  }

  private async persistSnapshot(
    executionId: string,
    snapshot: StateSnapshot,
    label?: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from('state_snapshots').insert({
        execution_id: executionId,
        version: snapshot.version,
        state: JSON.stringify(Object.fromEntries(snapshot.state)),
        label,
        created_at: snapshot.timestamp.toISOString(),
      });

      if (error) {
        this.logger.error(executionId, 'StateManager', 'Failed to persist snapshot', {
          error: error.message,
        });
      }
    } catch (error) {
      this.logger.error(executionId, 'StateManager', 'Snapshot persistence failed', {
        error: (error as Error).message,
      });
    }
  }
}

export {
  StateManager,
  StateSnapshot,
  StateTransition,
  StateValidator,
  StateValue,
};
