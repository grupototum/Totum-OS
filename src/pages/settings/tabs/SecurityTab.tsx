import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Shield, Key } from "lucide-react";

export function SecurityTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Senha atual é obrigatória";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Nova senha é obrigatória";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "A senha deve ter pelo menos 6 caracteres";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Verificar senha atual fazendo login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: formData.currentPassword,
      });

      if (signInError) {
        toast.error("Senha atual incorreta");
        setErrors({ currentPassword: "Senha atual incorreta" });
        return;
      }

      // Atualizar senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) throw updateError;

      toast.success("Senha alterada com sucesso!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Segurança</h3>
        <p className="text-sm text-zinc-400">
          Gerencie sua senha e configurações de segurança da conta
        </p>
      </div>

      {/* Password Change Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-zinc-400" />
          <h4 className="font-medium">Alterar Senha</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pl-8">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              placeholder="Digite sua senha atual"
              className={errors.currentPassword ? "border-red-500" : ""}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              placeholder="Digite a nova senha"
              className={errors.newPassword ? "border-red-500" : ""}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              placeholder="Confirme a nova senha"
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Alterar Senha
            </Button>
          </div>
        </form>
      </div>

      {/* Security Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-zinc-400" />
          <h4 className="font-medium">Informações de Segurança</h4>
        </div>

        <div className="pl-8 space-y-3">
          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticação</p>
                <p className="text-sm text-zinc-400">E-mail e senha</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                Ativo
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sessão Atual</p>
                <p className="text-sm text-zinc-400">
                  {user?.email} • {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section (Redirect) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-zinc-400" />
          <h4 className="font-medium">Chaves de API</h4>
        </div>

        <div className="pl-8">
          <p className="text-sm text-zinc-400 mb-3">
            Gerencie suas chaves de API em Configurações do Sistema
          </p>
          <p className="text-xs text-zinc-500">
            Acesse a aba &quot;Sistema&quot; para configurar suas API keys
          </p>
        </div>
      </div>
    </div>
  );
}
