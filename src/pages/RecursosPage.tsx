import AppLayout from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { centralResources } from "@/data/agentHierarchy";
import { Badge } from "@/components/ui/badge";
import { Notebook } from "lucide-react";

export default function RecursosPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Notebook className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-medium text-foreground tracking-tight">
                RECURSOS CENTRAIS
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Ferramentas integradas ao ecossistema
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {centralResources.map((res, i) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="border border-border bg-card rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <res.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{res.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{res.description}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  EM BREVE
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
