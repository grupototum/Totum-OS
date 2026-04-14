import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageTransition } from "@/hooks/usePageTransition";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { toast } from "@/hooks/use-toast";
import { validateClientBasicInfo, type ValidationErrors } from "@/lib/validation";
import {
  NewClientForm,
  NewClientPreview,
  NewClientSteps,
} from "./components";
import { useNewClient } from "./hooks";
import type { FormData } from "./hooks";

/**
 * NewClient Container Component
 * Manages form state, validation, and step navigation for creating new clients
 */
export function NewClientLayout() {
  const navigate = useNavigate();
  const pageTransition = usePageTransition();
  const [step, setStep] = React.useState(0);
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  const { form, setForm, saving, submit } = useNewClient();

  // Form setters
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const toggleArray = (
    key: "support_channels" | "working_days",
    value: string
  ) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));
  };

  // Validation
  const validate = (): boolean => {
    setErrors({});

    if (step === 0) {
      const validationErrors = validateClientBasicInfo(
        form.company_name,
        form.cnpj,
        form.contact_name,
        form.email,
        form.phone,
        form.website
      );

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast({
          title: "⚠️ Campos inválidos",
          description: Object.values(validationErrors)[0],
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  // Navigation
  const next = () => {
    if (validate() && step < 4) setStep(step + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  // Submit
  const handleSubmit = async () => {
    const validationErrors = validateClientBasicInfo(
      form.company_name,
      form.cnpj,
      form.contact_name,
      form.email,
      form.phone,
      form.website
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "⚠️ Campos inválidos",
        description: Object.values(validationErrors)[0],
        variant: "destructive",
      });
      return;
    }

    const success = await submit();
    if (success) {
      navigate("/clients");
    }
  };

  const progress = ((step + 1) / 5) * 100;

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground mb-3"
            onClick={() => navigate("/clients")}
          >
            <ArrowLeft className="w-3 h-3 mr-1" /> Voltar à Central
          </Button>
          <h1 className="font-sans text-2xl font-semibold text-foreground tracking-tight">
            NOVO CLIENTE
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            Etapa {step + 1} de 5
          </p>
        </motion.div>

        {/* Progress steps */}
        <NewClientSteps
          step={step}
          progress={progress}
          onStepClick={setStep}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Form area */}
          <div className="xl:col-span-3">
            <Card className="border-border/40 bg-card/80">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon =
                      require("./components/NewClientUtilities").STEPS[step]
                        .icon;
                    return (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    );
                  })()}
                  <div>
                    <CardTitle className="text-lg">
                      {require("./components/NewClientUtilities").STEPS[step]
                        .title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {require("./components/NewClientUtilities").STEPS[step]
                        .subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <NewClientForm
                  form={form}
                  step={step}
                  errors={errors}
                  onSet={set}
                  onToggleArray={toggleArray}
                />

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-border/30">
                  <Button
                    variant="ghost"
                    onClick={prev}
                    disabled={step === 0}
                    className="text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                  </Button>
                  {step < 4 ? (
                    <Button
                      onClick={next}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                    >
                      Próximo <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />{" "}
                          Criando...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" /> Criar Cliente
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview sidebar */}
          <div className="xl:col-span-1">
            <NewClientPreview form={form} step={step} />
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
