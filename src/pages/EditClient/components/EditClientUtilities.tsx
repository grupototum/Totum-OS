import React from "react";
import { Label } from "@/components/ui/label";
import {
  Building2, Briefcase, Target, Palette, Settings2,
} from "lucide-react";

export const STEPS = [
  {
    title: "Informações da Empresa",
    subtitle: "Dados principais do cliente",
    icon: Building2,
  },
  {
    title: "Sobre o Negócio",
    subtitle: "Contexto do cliente",
    icon: Briefcase,
  },
  {
    title: "Público-Alvo",
    subtitle: "Quem são os clientes ideais?",
    icon: Target,
  },
  {
    title: "Identidade Visual",
    subtitle: "Aparência da marca",
    icon: Palette,
  },
  {
    title: "Operação e Contatos",
    subtitle: "Detalhes operacionais",
    icon: Settings2,
  },
];

export const INDUSTRIES = [
  "Saúde",
  "Tecnologia",
  "Educação",
  "E-commerce",
  "Serviços",
  "Outros",
];
export const TIME_OPTIONS = [
  "Menos de 1 ano",
  "1-3 anos",
  "3-5 anos",
  "5+ anos",
];
export const SIZE_OPTIONS = ["Startup", "PME", "Grande empresa"];
export const REVENUE_OPTIONS = [
  "Até R$ 10k",
  "R$ 10k-50k",
  "R$ 50k-200k",
  "R$ 200k-1M",
  "R$ 1M+",
];
export const TONE_OPTIONS = [
  "Formal",
  "Descontraído",
  "Técnico",
  "Empático",
  "Irreverente",
];
export const LOCATION_OPTIONS = ["Nacional", "Regional", "Internacional"];
export const SOCIAL_OPTIONS = ["A", "B", "C", "D/E"];
export const CRM_OPTIONS = [
  "Kommo",
  "HubSpot",
  "Pipedrive",
  "Salesforce",
  "Outro",
  "Nenhum",
];
export const SLA_OPTIONS = ["1h", "2h", "4h", "8h", "24h"];
export const CHANNEL_OPTIONS = [
  "WhatsApp",
  "Email",
  "Telefone",
  "Chat",
  "Redes Sociais",
];
export const DAY_OPTIONS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const cnpjMask = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);

export const phoneMask = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);

export function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Label className="text-sm text-foreground font-medium">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}

export function ErrorMessage({ field }: { field: string | undefined }) {
  return field ? (
    <p className="text-xs text-destructive mt-1">{field}</p>
  ) : null;
}
