import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { STEPS } from "./NewClientUtilities";
import type { FormData } from "../hooks";

interface NewClientPreviewProps {
  form: FormData;
  step: number;
}

export function NewClientPreview({ form, step }: NewClientPreviewProps) {
  return (
    <div className="sticky top-24">
      <Card className="border-border/40 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Preview do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="w-16 h-16 rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-border/60"
            style={{ backgroundColor: form.primary_color + "20" }}
          >
            {form.company_name ? (
              <span
                className="text-2xl font-sans font-bold"
                style={{ color: form.primary_color }}
              >
                {form.company_name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-6 h-6 text-muted-foreground" />
            )}
          </div>

          <div className="text-center">
            <p className="font-sans font-semibold text-foreground text-sm">
              {form.company_name || "Nome da Empresa"}
            </p>
            {form.industry && (
              <Badge
                variant="outline"
                className="text-[10px] mt-1 bg-primary/10 text-primary border-primary/30"
              >
                {form.industry}
              </Badge>
            )}
          </div>

          <div className="text-center">
            <Badge
              variant="outline"
              className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/30"
            >
              Criando...
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            {form.contact_name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Responsável</span>
                <span className="text-foreground">{form.contact_name}</span>
              </div>
            )}
            {form.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground truncate ml-2">
                  {form.email}
                </span>
              </div>
            )}
            {form.company_size && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Porte</span>
                <span className="text-foreground">{form.company_size}</span>
              </div>
            )}
            {form.brand_tone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tom</span>
                <span className="text-foreground">{form.brand_tone}</span>
              </div>
            )}
            {form.crm_used && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">CRM</span>
                <span className="text-foreground">{form.crm_used}</span>
              </div>
            )}
          </div>

          {(form.primary_color || form.secondary_color) && (
            <div className="flex gap-2 justify-center">
              <div
                className="w-8 h-8 rounded-lg border border-border/40"
                style={{ backgroundColor: form.primary_color }}
                title="Primária"
              />
              <div
                className="w-8 h-8 rounded-lg border border-border/40"
                style={{ backgroundColor: form.secondary_color }}
                title="Secundária"
              />
            </div>
          )}

          <div className="pt-2 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground text-center">
              Etapa {step + 1} de 5
            </p>
            <div className="flex gap-1 mt-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    i <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
