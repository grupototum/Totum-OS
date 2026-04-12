import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera } from "lucide-react";

export function ProfileTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role, phone, avatar_url")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setFormData({
        fullName: data?.full_name || "",
        email: user?.email || "",
        role: data?.role || "",
        phone: data?.phone || "",
        avatarUrl: data?.avatar_url || "",
      });
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          role: formData.role,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Upload do arquivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      // Atualizar perfil
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      setFormData((prev) => ({ ...prev, avatarUrl }));
      toast.success("Avatar atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload do avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-zinc-400">
          Gerencie suas informações pessoais e foto de perfil
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={formData.avatarUrl} />
            <AvatarFallback className="text-2xl bg-zinc-800 text-zinc-300">
              {formData.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="avatar-upload"
            className="absolute -bottom-2 -right-2 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full cursor-pointer border border-zinc-700 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={uploading}
          />
        </div>
        <div>
          <p className="font-medium">Foto de Perfil</p>
          <p className="text-sm text-zinc-400">
            Clique no ícone da câmera para alterar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-zinc-900/50"
            />
            <p className="text-xs text-zinc-500">O e-mail não pode ser alterado</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              placeholder="Ex: Desenvolvedor, Designer, etc"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
