import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FieldLabel,
  ErrorMessage,
  cnpjMask,
  phoneMask,
  INDUSTRIES,
  TIME_OPTIONS,
  SIZE_OPTIONS,
  REVENUE_OPTIONS,
  TONE_OPTIONS,
  LOCATION_OPTIONS,
  SOCIAL_OPTIONS,
  CRM_OPTIONS,
  SLA_OPTIONS,
  CHANNEL_OPTIONS,
  DAY_OPTIONS,
} from "./EditClientUtilities";
import type { FormData } from "../hooks";
import type { ValidationErrors } from "@/lib/validation";

interface EditClientFormProps {
  form: FormData;
  step: number;
  errors: ValidationErrors;
  onSet: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onToggleArray: (key: "support_channels" | "working_days", value: string) => void;
}

export function EditClientForm({
  form,
  step,
  errors,
  onSet,
  onToggleArray,
}: EditClientFormProps) {
  const inputCls = (key: string) =>
    `bg-secondary border-border/40 h-10 text-sm ${
      errors[key] ? "border-destructive focus-visible:ring-destructive" : ""
    }`;
  const textareaCls = (key: string) =>
    `bg-secondary border-border/40 text-sm min-h-[80px] resize-none ${
      errors[key] ? "border-destructive focus-visible:ring-destructive" : ""
    }`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        {/* Step 0: Company Info */}
        {step === 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Nome da empresa</FieldLabel>
                <Input
                  value={form.company_name}
                  onChange={(e) => onSet("company_name", e.target.value)}
                  className={inputCls("company_name")}
                  placeholder="Ex: Totum Digital"
                />
                <ErrorMessage field={errors.company_name} />
              </div>
              <div>
                <FieldLabel required>CNPJ</FieldLabel>
                <Input
                  value={form.cnpj}
                  onChange={(e) => onSet("cnpj", cnpjMask(e.target.value))}
                  className={inputCls("cnpj")}
                  placeholder="00.000.000/0000-00"
                />
                <ErrorMessage field={errors.cnpj} />
              </div>
            </div>
            <div>
              <FieldLabel required>Nome do responsável</FieldLabel>
              <Input
                value={form.contact_name}
                onChange={(e) => onSet("contact_name", e.target.value)}
                className={inputCls("contact_name")}
                placeholder="Nome completo"
              />
              <ErrorMessage field={errors.contact_name} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Email corporativo</FieldLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => onSet("email", e.target.value)}
                  className={inputCls("email")}
                  placeholder="email@empresa.com"
                />
                <ErrorMessage field={errors.email} />
              </div>
              <div>
                <FieldLabel required>Telefone</FieldLabel>
                <Input
                  value={form.phone}
                  onChange={(e) => onSet("phone", phoneMask(e.target.value))}
                  className={inputCls("phone")}
                  placeholder="(00) 00000-0000"
                />
                <ErrorMessage field={errors.phone} />
              </div>
            </div>
            <div>
              <FieldLabel>Site</FieldLabel>
              <Input
                value={form.website}
                onChange={(e) => onSet("website", e.target.value)}
                className={inputCls("website")}
                placeholder="https://www.empresa.com"
              />
              <ErrorMessage field={errors.website} />
            </div>
          </>
        )}

        {/* Step 1: Business Info */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Ramo de atuação</FieldLabel>
                <Select
                  value={form.industry}
                  onValueChange={(v) => onSet("industry", v)}
                >
                  <SelectTrigger className="bg-secondary border-border/40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>Tempo de mercado</FieldLabel>
                <Select
                  value={form.time_in_market}
                  onValueChange={(v) => onSet("time_in_market", v)}
                >
                  <SelectTrigger className="bg-secondary border-border/40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <FieldLabel>Descrição do negócio</FieldLabel>
              <textarea
                value={form.business_description}
                onChange={(e) => onSet("business_description", e.target.value)}
                className={`w-full rounded-md px-3 py-2 ${textareaCls("")}`}
                placeholder="O que a empresa faz?"
              />
            </div>
            <div>
              <FieldLabel>Produtos/Serviços oferecidos</FieldLabel>
              <textarea
                value={form.products_services}
                onChange={(e) => onSet("products_services", e.target.value)}
                className={`w-full rounded-md px-3 py-2 ${textareaCls("")}`}
                placeholder="Liste os principais produtos ou serviços"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Tamanho da empresa</FieldLabel>
                <Select
                  value={form.company_size}
                  onValueChange={(v) => onSet("company_size", v)}
                >
                  <SelectTrigger className="bg-secondary border-border/40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_OPTIONS.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>Faturamento mensal</FieldLabel>
                <Select
                  value={form.monthly_revenue}
                  onValueChange={(v) => onSet("monthly_revenue", v)}
                >
                  <SelectTrigger className="bg-secondary border-border/40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_OPTIONS.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Target Audience */}
        {step === 2 && (
          <>
            <div>
              <FieldLabel>Nicho principal</FieldLabel>
              <Input
                value={form.main_niche}
                onChange={(e) => onSet("main_niche", e.target.value)}
                className={inputCls("")}
                placeholder="Ex: Mães de primeira viagem"
              />
            </div>
            <div>
              <FieldLabel>Dores principais</FieldLabel>
              <textarea
                value={form.main_pains}
                onChange={(e) => onSet("main_pains", e.target.value)}
                className={`w-full rounded-md px-3 py-2 ${textareaCls("")}`}
                placeholder="Liste 3-5 dores do público"
              />
            </div>
            <div>
              <FieldLabel>Desejos/Objetivos</FieldLabel>
              <textarea
                value={form.desires}
                onChange={(e) => onSet("desires", e.target.value)}
                className={`w-full rounded-md px-3 py-2 ${textareaCls("")}`}
                placeholder="O que o público deseja alcançar?"
              />
            </div>
            <div>
              <FieldLabel>
                Faixa etária: {form.age_min} - {form.age_max}+
              </FieldLabel>
              <div className="mt-2 px-2">
                <Slider
                  value={[form.age_min, form.age_max]}
                  min={18}
                  max={65}
                  step={1}
                  onValueChange={([min, max]) => {
                    onSet("age_min", min);
                    onSet("age_max", max);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel>Gênero</FieldLabel>
                <div className="flex gap-2 mt-1">
                  {["Masculino", "Feminino", "Ambos"].map((g) => (
                    <button
                      key={g}
                      onClick={() => onSet("gender", g.toLowerCase())}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        form.gender === g.toLowerCase()
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Localização</FieldLabel>
                <Select
                  value={form.location}
                  onValueChange={(v) => onSet("location", v)}
                >
                  <SelectTrigger className="bg-secondary border-border/40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_OPTIONS.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>Classe social</FieldLabel>
                <Select
                  value={form.social_class}
                  onValueChange={(v) => onSet("social_class", v)}
                >
                  <SelectTrigger className="bg-secondary border-border/40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_OPTIONS.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <FieldLabel>Tom de voz da marca</FieldLabel>
              <Select
                value={form.brand_tone}
                onValueChange={(v) => onSet("brand_tone", v)}
              >
                <SelectTrigger className="bg-secondary border-border/40">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Step 3: Visual Identity */}
        {step === 3 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Cor primária</FieldLabel>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={form.primary_color}
                    onChange={(e) => onSet("primary_color", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border/40 cursor-pointer bg-transparent"
                  />
                  <Input
                    value={form.primary_color}
                    onChange={(e) => onSet("primary_color", e.target.value)}
                    className={`${inputCls("")} flex-1`}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Cor secundária</FieldLabel>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={form.secondary_color}
                    onChange={(e) => onSet("secondary_color", e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border/40 cursor-pointer bg-transparent"
                  />
                  <Input
                    value={form.secondary_color}
                    onChange={(e) => onSet("secondary_color", e.target.value)}
                    className={`${inputCls("")} flex-1`}
                  />
                </div>
              </div>
            </div>
            <div>
              <FieldLabel>Fontes utilizadas</FieldLabel>
              <Input
                value={form.fonts}
                onChange={(e) => onSet("fonts", e.target.value)}
                className={inputCls("")}
                placeholder="Ex: Inter, Montserrat"
              />
            </div>
            <div>
              <FieldLabel>Key visual / Elementos gráficos</FieldLabel>
              <textarea
                value={form.visual_elements}
                onChange={(e) => onSet("visual_elements", e.target.value)}
                className={`w-full rounded-md px-3 py-2 ${textareaCls("")}`}
                placeholder="Descreva os elementos visuais"
              />
            </div>
            <div>
              <FieldLabel>Personalidade visual</FieldLabel>
              <textarea
                value={form.visual_personality}
                onChange={(e) => onSet("visual_personality", e.target.value)}
                className={`w-full rounded-md px-3 py-2 ${textareaCls("")}`}
                placeholder="Como a marca deve ser percebida visualmente?"
              />
            </div>
          </>
        )}

        {/* Step 4: Operations */}
        {step === 4 && (
          <>
            <div>
              <FieldLabel>Canais de atendimento</FieldLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {CHANNEL_OPTIONS.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => onToggleArray("support_channels", ch)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      form.support_channels.includes(ch)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>CRM utilizado</FieldLabel>
                <Select
                  value={form.crm_used}
                  onValueChange={(v) => onSet("crm_used", v)}
                >
                  <SelectTrigger className="bg-secondary border-border/40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CRM_OPTIONS.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel>SLA de resposta</FieldLabel>
                <Select
                  value={form.sla_response}
                  onValueChange={(v) => onSet("sla_response", v)}
                >
                  <SelectTrigger className="bg-secondary border-border/40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SLA_OPTIONS.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Horário início</FieldLabel>
                <Input
                  type="time"
                  value={form.business_hours_start}
                  onChange={(e) =>
                    onSet("business_hours_start", e.target.value)
                  }
                  className={inputCls("")}
                />
              </div>
              <div>
                <FieldLabel>Horário fim</FieldLabel>
                <Input
                  type="time"
                  value={form.business_hours_end}
                  onChange={(e) => onSet("business_hours_end", e.target.value)}
                  className={inputCls("")}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Dias de atendimento</FieldLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {DAY_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => onToggleArray("working_days", d)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      form.working_days.includes(d)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Informações adicionais</FieldLabel>
              <textarea
                value={form.additional_info}
                onChange={(e) => onSet("additional_info", e.target.value)}
                className={`w-full rounded-md px-3 py-2 ${textareaCls("")}`}
                placeholder="Algo mais que devamos saber?"
              />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Checkbox
                checked={form.terms_accepted}
                onCheckedChange={(c) => onSet("terms_accepted", !!c)}
              />
              <span className="text-sm text-foreground">
                Aceito os termos de uso e política de privacidade
              </span>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
