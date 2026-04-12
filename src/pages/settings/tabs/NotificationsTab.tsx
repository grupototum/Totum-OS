import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Bell, MessageSquare } from "lucide-react";

interface NotificationSettings {
  email_tasks: boolean;
  email_mentions: boolean;
  email_updates: boolean;
  push_notifications: boolean;
}

const defaultSettings: NotificationSettings = {
  email_tasks: true,
  email_mentions: true,
  email_updates: false,
  push_notifications: true,
};

export function NotificationsTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("notification_settings")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        // Se não encontrou, cria configurações padrão
        if (error.code === "PGRST116") {
          await createDefaultSettings();
          return;
        }
        throw error;
      }

      if (data?.notification_settings) {
        setSettings({ ...defaultSettings, ...data.notification_settings });
      }
    } catch (error: any) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações de notificações");
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const { error } = await supabase.from("user_settings").insert({
        user_id: user?.id,
        notification_settings: defaultSettings,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao criar configurações padrão:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user?.id,
          notification_settings: settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Configurações de notificações salvas!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notificações</h3>
        <p className="text-sm text-zinc-400">
          Escolha como e quando deseja receber notificações
        </p>
      </div>

      <div className="space-y-6">
        {/* E-mail Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-zinc-400" />
            <h4 className="font-medium">E-mail</h4>
          </div>

          <div className="space-y-4 pl-8">
            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div className="space-y-0.5">
                <Label htmlFor="email_tasks" className="cursor-pointer">
                  Novas tarefas
                </Label>
                <p className="text-sm text-zinc-500">
                  Receba e-mail quando for atribuído a uma nova tarefa
                </p>
              </div>
              <Switch
                id="email_tasks"
                checked={settings.email_tasks}
                onCheckedChange={(checked) => updateSetting("email_tasks", checked)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div className="space-y-0.5">
                <Label htmlFor="email_mentions" className="cursor-pointer">
                  Menções
                </Label>
                <p className="text-sm text-zinc-500">
                  Receba e-mail quando alguém mencionar você
                </p>
              </div>
              <Switch
                id="email_mentions"
                checked={settings.email_mentions}
                onCheckedChange={(checked) => updateSetting("email_mentions", checked)}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div className="space-y-0.5">
                <Label htmlFor="email_updates" className="cursor-pointer">
                  Atualizações do sistema
                </Label>
                <p className="text-sm text-zinc-500">
                  Receba e-mail sobre atualizações e novidades
                </p>
              </div>
              <Switch
                id="email_updates"
                checked={settings.email_updates}
                onCheckedChange={(checked) => updateSetting("email_updates", checked)}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-zinc-400" />
            <h4 className="font-medium">Push</h4>
          </div>

          <div className="pl-8">
            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div className="space-y-0.5">
                <Label htmlFor="push_notifications" className="cursor-pointer">
                  Notificações push
                </Label>
                <p className="text-sm text-zinc-500">
                  Receba notificações no navegador
                </p>
              </div>
              <Switch
                id="push_notifications"
                checked={settings.push_notifications}
                onCheckedChange={(checked) => updateSetting("push_notifications", checked)}
              />
            </div>
          </div>
        </div>

        {/* Chat/Messages */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-zinc-400" />
            <h4 className="font-medium">Mensagens</h4>
          </div>

          <div className="pl-8">
            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div className="space-y-0.5">
                <Label htmlFor="chat_notifications" className="cursor-pointer">
                  Mensagens de agentes
                </Label>
                <p className="text-sm text-zinc-500">
                  Receba notificações de novas mensagens dos agentes
                </p>
              </div>
              <Switch
                id="chat_notifications"
                checked={true}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Preferências
        </Button>
      </div>
    </div>
  );
}
