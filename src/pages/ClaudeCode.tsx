import AppLayout from "@/components/layout/AppLayout";
import { Terminal, Cpu, Zap, Clock, FolderOpen, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

export default function ClaudeCode() {
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-medium text-foreground tracking-tight">
                CLAUDE CODE
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                AI-Powered Development Environment
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Terminal area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  claude-code — totum-workspace
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-6 font-mono text-sm min-h-[500px] bg-[hsl(0_0%_4%)]">
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <span className="text-primary">$</span>{" "}
                    <span className="text-foreground">claude</span>{" "}
                    <span className="text-muted-foreground">--project totum-apps</span>
                  </div>
                  <div className="text-emerald-400">
                    ✓ Connected to Claude Code
                  </div>
                  <div className="text-muted-foreground/60">
                    Model: claude-sonnet-4-20250514 · Context: 200k tokens
                  </div>
                  <div className="mt-6 border-t border-border/30 pt-4">
                    <span className="text-primary">claude</span>
                    <span className="text-muted-foreground"> › </span>
                    <span className="text-foreground/80">
                      Ready. Describe what you want to build...
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-primary">❯</span>
                    <div className="w-2 h-5 bg-primary/60 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right panel */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Status */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="label-industrial text-[10px] text-muted-foreground mb-3">STATUS</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-foreground">Connected</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Model</span>
                  <span className="text-foreground font-mono text-[11px]">Sonnet 4</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tokens</span>
                  <span className="text-foreground font-mono text-[11px]">200k</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="label-industrial text-[10px] text-muted-foreground mb-3">QUICK ACTIONS</p>
              <div className="space-y-1.5">
                {[
                  { icon: FolderOpen, label: "Open Project" },
                  { icon: GitBranch, label: "Git Status" },
                  { icon: Cpu, label: "Run Tests" },
                  { icon: Zap, label: "Deploy" },
                  { icon: Clock, label: "History" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Session info */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="label-industrial text-[10px] text-muted-foreground mb-3">SESSION</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground font-mono">00:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="text-foreground font-mono">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files</span>
                  <span className="text-foreground font-mono">0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
