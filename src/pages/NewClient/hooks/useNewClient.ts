import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeURL } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";

export interface FormData {
  company_name: string;
  cnpj: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  business_description: string;
  products_services: string;
  time_in_market: string;
  company_size: string;
  monthly_revenue: string;
  main_niche: string;
  main_pains: string;
  desires: string;
  age_min: number;
  age_max: number;
  gender: string;
  location: string;
  social_class: string;
  brand_tone: string;
  primary_color: string;
  secondary_color: string;
  fonts: string;
  visual_elements: string;
  visual_personality: string;
  support_channels: string[];
  crm_used: string;
  sla_response: string;
  business_hours_start: string;
  business_hours_end: string;
  working_days: string[];
  additional_info: string;
  terms_accepted: boolean;
}

const INITIAL: FormData = {
  company_name: "",
  cnpj: "",
  contact_name: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  business_description: "",
  products_services: "",
  time_in_market: "",
  company_size: "",
  monthly_revenue: "",
  main_niche: "",
  main_pains: "",
  desires: "",
  age_min: 18,
  age_max: 65,
  gender: "both",
  location: "",
  social_class: "",
  brand_tone: "",
  primary_color: "#f76926",
  secondary_color: "#1a1a2e",
  fonts: "",
  visual_elements: "",
  visual_personality: "",
  support_channels: [],
  crm_used: "",
  sla_response: "",
  business_hours_start: "08:00",
  business_hours_end: "18:00",
  working_days: [],
  additional_info: "",
  terms_accepted: false,
};

export function useNewClient() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const submit = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "❌ Não autenticado",
        description: "Você precisa estar logado para criar um cliente.",
        variant: "destructive",
      });
      return false;
    }

    const sanitizedWebsite = form.website ? sanitizeURL(form.website) : null;

    setSaving(true);
    const { data, error } = await supabase
      .from("clients")
      .insert({
        company_name: form.company_name,
        cnpj: form.cnpj,
        contact_name: form.contact_name,
        email: form.email,
        phone: form.phone,
        website: sanitizedWebsite,
        industry: form.industry || null,
        business_description: form.business_description || null,
        products_services: form.products_services || null,
        time_in_market: form.time_in_market || null,
        company_size: form.company_size || null,
        monthly_revenue: form.monthly_revenue || null,
        main_niche: form.main_niche || null,
        main_pains: form.main_pains || null,
        desires: form.desires || null,
        age_min: form.age_min,
        age_max: form.age_max,
        gender: form.gender,
        location: form.location || null,
        social_class: form.social_class || null,
        brand_tone: form.brand_tone || null,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        fonts: form.fonts || null,
        visual_elements: form.visual_elements || null,
        visual_personality: form.visual_personality || null,
        support_channels: form.support_channels,
        crm_used: form.crm_used || null,
        sla_response: form.sla_response || null,
        business_hours_start: form.business_hours_start,
        business_hours_end: form.business_hours_end,
        working_days: form.working_days,
        additional_info: form.additional_info || null,
        terms_accepted: form.terms_accepted,
        status: "pending",
      } as any)
      .select()
      .single();

    setSaving(false);

    if (error) {
      toast({
        title: "❌ Erro",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "✅ Cliente criado!",
      description: `${form.company_name} cadastrado com sucesso`,
    });
    return true;
  };

  return {
    form,
    setForm,
    saving,
    submit,
  };
}
