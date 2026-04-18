import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getN8NEditorUrl, getWebhookUrl, isN8NConfigured } from "./n8n";

describe("n8n service (pure helpers)", () => {
  describe("getN8NEditorUrl", () => {
    it("falls back to n8n.io when no base URL is configured", () => {
      const url = getN8NEditorUrl();
      // No env / localStorage → base defaults to https://n8n.io
      expect(url.startsWith("https://")).toBe(true);
      expect(url.endsWith("/workflow")).toBe(true);
    });

    it("appends workflowId when provided", () => {
      const url = getN8NEditorUrl("abc123");
      expect(url).toMatch(/\/workflow\/abc123$/);
    });

    it("appends agentId as query string when both provided", () => {
      const url = getN8NEditorUrl("abc123", "radar");
      expect(url).toContain("/workflow/abc123?agentId=radar");
    });
  });

  describe("getWebhookUrl", () => {
    it("returns a URL ending with the webhook path", () => {
      const url = getWebhookUrl("my-hook");
      expect(url.endsWith("/webhook/my-hook")).toBe(true);
    });
  });

  describe("isN8NConfigured", () => {
    it("returns a boolean", () => {
      // Value depends on env — just assert shape
      expect(typeof isN8NConfigured()).toBe("boolean");
    });
  });
});

// Separate file-level fetch mock block for the network helpers
describe("n8n service (network helpers)", () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("checkN8NHealth returns false when not configured", async () => {
    // With no VITE_N8N_URL in test env, checkN8NHealth should early-return false
    const { checkN8NHealth } = await import("./n8n");
    const healthy = await checkN8NHealth();
    expect(healthy).toBe(false);
  });
});
