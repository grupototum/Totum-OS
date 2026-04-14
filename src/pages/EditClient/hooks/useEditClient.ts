import { useState, useEffect } from "react";
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

export function useEditClient(clientId: string | undefined) {
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      if (!clientId) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (data) {
        setForm({
          company_name: data.company_name ?? "",
          cnpj: data.cnpj ?? "",
          contact_name: data.contact_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          industry: data.industry ?? "",
          business_description: data.business_description ?? "",
          products_services: data.products_services ?? "",
          time_in_market: data.time_in_market ?? "",
          company_size: data.company_size ?? "",
          monthly_revenue: data.monthly_revenue ?? "",
          main_niche: data.main_niche ?? "",
          main_pains: data.main_pains ?? "",
          desires: data.desires ?? "",
          age_min: data.age_min ?? 18,
          age_max: data.age_max ?? 65,
          gender: data.gender ?? "both",
          location: data.location ?? "",
          social_class: data.social_class ?? "",
          brand_tone: data.brand_tone ?? "",
          primary_color: data.primary_color ?? "#f76926",
          secondary_color: data.secondary_color ?? "#1a1a2e",
          fonts: data.fonts ?? "",
          visual_elements: data.visual_elements ?? "",
          visual_personality: data.visual_personality ?? "",
          support_channels: (data.support_channels as string[]) ?? [],
          crm_used: data.crm_used ?? "",
          sla_response: data.sla_response ?? "",
          business_hours_start: data.business_hours_start ?? "08:00",
          business_hours_end: data.business_hours_end ?? "18:00",
          working_days: (data.working_days as string[]) ?? [],
          additional_info: data.additional_info ?? "",
          terms_accepted: data.terms_accepted ?? false,
        });
      }
      setLoading(false);
    }

    load();
  }, [clientId]);

  const submit = async (): Promise<boolean> => {
    if (!user || !clientId || !form) return false;

    const sanitizedWebsite = form.website ? sanitizeURL(form.website) : null;

    setSaving(true);
    const { error } = await supabase
      .from("clients")
      .update({
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
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", clientId);

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
      title: "✅ Cliente atualizado!",
      description: `${form.company_name} salvo com sucesso`,
    });
    return true;
  };

  return {
    form,
    setForm,
    loading,
    saving,
    submit,
  };
}
