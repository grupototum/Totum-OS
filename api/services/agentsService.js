/**
 * Agents Service — Operações CRUD para elizaOS agents
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: { autoRefreshToken: false, persistSession: false }
});

function toElizaCharacter(agent) {
  return {
    id: agent.id,
    name: agent.name,
    bio: agent.bio,
    tier: agent.tier
  };
}

export async function listAgents() {
  try {
    const { data, error } = await supabase
      .from('agents_config')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, agents: data || [] };
  } catch (err) {
    return { success: false, agents: [], error: err.message };
  }
}

export async function getAgent(id) {
  try {
    const { data, error } = await supabase
      .from('agents_config')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, agent: data, character: toElizaCharacter(data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function createAgent(payload) {
  try {
    if (!payload.name || !payload.bio || !payload.system_prompt) {
      throw new Error('Missing required fields: name, bio, system_prompt');
    }

    const agentId = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const agentData = {
      agent_id: agentId,
      name: payload.name,
      bio: payload.bio,
      system_prompt: payload.system_prompt,
      tier: payload.tier || 2,
      status: 'active'
    };

    const { data, error } = await supabase
      .from('agents_config')
      .insert([agentData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, agent: data, character: toElizaCharacter(data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateAgent(id, payload) {
  try {
    const updates = {};
    if (payload.name) updates.name = payload.name;
    if (payload.bio) updates.bio = payload.bio;
    if (payload.system_prompt) updates.system_prompt = payload.system_prompt;
    if (payload.tier) updates.tier = payload.tier;

    const { data, error } = await supabase
      .from('agents_config')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, agent: data, character: toElizaCharacter(data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteAgent(id) {
  try {
    const { error } = await supabase.from('agents_config').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Agent deleted successfully' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
