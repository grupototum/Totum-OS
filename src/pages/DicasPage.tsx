import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Lightbulb, ExternalLink } from "lucide-react";
import { tipCategories } from "@/data/agentHierarchy";

export default function DicasPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-medium text-foreground tracking-tight">
                DICAS & RECURSOS
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Ferramentas e hacks de IA
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="space-y-8">
          {tipCategories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + ci * 0.05 }}
            >
              <h2 className="font-sans text-lg text-foreground mb-3">{cat.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.tips.map((tip) => (
                  <div
                    key={tip.name}
                    className="group border border-border bg-card rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {tip.name}
                      </h3>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
