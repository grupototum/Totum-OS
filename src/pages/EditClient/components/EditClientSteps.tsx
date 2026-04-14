import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { STEPS } from "./EditClientUtilities";

interface EditClientStepsProps {
  step: number;
  progress: number;
  onStepClick: (newStep: number) => void;
}

export function EditClientSteps({
  step,
  progress,
  onStepClick,
}: EditClientStepsProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
      <div className="flex items-center gap-1 mb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex items-center gap-1">
            <button
              onClick={() => onStepClick(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                      ? "bg-primary-foreground text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="hidden lg:inline truncate">{s.title}</span>
            </button>
            {i < 4 && (
              <div
                className={`w-4 h-0.5 shrink-0 ${
                  i < step ? "bg-emerald-500" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
