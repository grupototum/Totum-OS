import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sun, Moon, Monitor, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

export function AppearanceTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (user) {
      loadTheme();
    }
  }, [user]);

  const loadTheme = async () => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("theme")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data?.theme) {
        setCurrentTheme(data.theme as Theme);
      } else {
        // Verificar localStorage ou preferência do sistema
        const stored = localStorage.getItem("totum-theme") as Theme;
        if (stored) {
          setCurrentTheme(stored);
        }
      }
    } catch (error: any) {
      console.error("Erro ao carregar tema:", error);
    }
  };

  const handleThemeChange = async (value: Theme) => {
    setLoading(true);
    
    try {
      // Aplicar tema imediatamente
      setCurrentTheme(value);
      
      const root = document.documentElement;
      
      if (value === "system") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemPrefersDark) {
          root.classList.add("dark");
          root.classList.remove("light");
        } else {
          root.classList.add("light");
          root.classList.remove("dark");
        }
      } else if (value === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }

      localStorage.setItem("totum-theme", value);

      // Salvar no Supabase
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user?.id,
          theme: value,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Tema atualizado!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar tema");
    } finally {
      setLoading(false);
    }
  };

  const themes = [
    {
      value: "light" as Theme,
      label: "Claro",
      description: "Tema claro para ambientes bem iluminados",
      icon: Sun,
    },
    {
      value: "dark" as Theme,
      label: "Escuro",
      description: "Tema escuro para uso noturno",
      icon: Moon,
    },
    {
      value: "system" as Theme,
      label: "Sistema",
      description: "Segue a preferência do sistema operacional",
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Aparência</h3>
        <p className="text-sm text-zinc-400">
          Personalize a aparência do aplicativo
        </p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-zinc-400" />
          <h4 className="font-medium">Tema</h4>
        </div>

        <RadioGroup
          value={currentTheme}
          onValueChange={(value) => handleThemeChange(value as Theme)}
          className="grid gap-4 pl-8"
          disabled={loading}
        >
          {themes.map((theme) => (
            <div key={theme.value}>
              <RadioGroupItem
                value={theme.value}
                id={theme.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={theme.value}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border border-zinc-800 cursor-pointer transition-all",
                  "hover:border-zinc-700 hover:bg-zinc-900/50",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                <theme.icon className="w-5 h-5 text-zinc-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{theme.label}</p>
                    {currentTheme === theme.value && loading && (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">{theme.description}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <h4 className="font-medium">Pré-visualização</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
            <p className="text-sm font-medium mb-2">Botões Primários</p>
            <div className="flex gap-2">
              <Button size="sm">Primário</Button>
              <Button size="sm" variant="secondary">
                Secundário
              </Button>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
            <p className="text-sm font-medium mb-2">Estado</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                Ativo
              </span>
              <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded">
                Inativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
        <p className="text-sm text-zinc-400">
          <strong>Nota:</strong> Algumas páginas podem não suportar totalmente o modo claro.
          Recomendamos o uso do modo escuro para a melhor experiência.
        </p>
      </div>
    </div>
  );
}
