import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Key, Eye, EyeOff, Server, Zap, Bot } from "lucide-react";

interface ApiKeys {
  claudeApiKey: string;
  openaiApiKey: string;
  ollamaHost: string;
}

const STORAGE_KEY = "totum-api-keys";

export function SystemTab() {
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    claude: false,
    openai: false,
  });
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    claudeApiKey: "",
    openaiApiKey: "",
    ollamaHost: "http://localhost:11434",
  });

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setApiKeys((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error("Erro ao carregar API keys:", error);
    }
  };

  const handleSave = () => {
    setLoading(true);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiKeys));
      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKeys({
      claudeApiKey: "",
      openaiApiKey: "",
      ollamaHost: "http://localhost:11434",
    });
    toast.success("Configurações limpas!");
  };

  const maskKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 8) return "•".repeat(key.length);
    return key.slice(0, 4) + "•".repeat(key.length - 8) + key.slice(-4);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sistema</h3>
        <p className="text-sm text-zinc-400">
          Configure integrações com serviços externos
        </p>
      </div>

      {/* Claude API */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-zinc-400" />
          <h4 className="font-medium">Claude (Anthropic)</h4>
        </div>

        <div className="pl-8 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="claudeApiKey">API Key</Label>
            <div className="relative">
              <Input
                id="claudeApiKey"
                type={showKeys.claude ? "text" : "password"}
                value={apiKeys.claudeApiKey}
                onChange={(e) =>
                  setApiKeys((prev) => ({ ...prev, claudeApiKey: e.target.value }))
                }
                placeholder="sk-ant-..."
                className="pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setShowKeys((prev) => ({ ...prev, claude: !prev.claude }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showKeys.claude ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              {apiKeys.claudeApiKey
                ? `Chave salva: ${maskKey(apiKeys.claudeApiKey)}`
                : "Nenhuma chave configurada"}
            </p>
          </div>
        </div>
      </div>

      {/* OpenAI API */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-zinc-400" />
          <h4 className="font-medium">OpenAI</h4>
        </div>

        <div className="pl-8 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="openaiApiKey">API Key</Label>
            <div className="relative">
              <Input
                id="openaiApiKey"
                type={showKeys.openai ? "text" : "password"}
                value={apiKeys.openaiApiKey}
                onChange={(e) =>
                  setApiKeys((prev) => ({ ...prev, openaiApiKey: e.target.value }))
                }
                placeholder="sk-..."
                className="pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setShowKeys((prev) => ({ ...prev, openai: !prev.openai }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showKeys.openai ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              {apiKeys.openaiApiKey
                ? `Chave salva: ${maskKey(apiKeys.openaiApiKey)}`
                : "Nenhuma chave configurada"}
            </p>
          </div>
        </div>
      </div>

      {/* Ollama */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-zinc-400" />
          <h4 className="font-medium">Ollama (Local)</h4>
        </div>

        <div className="pl-8 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="ollamaHost">Host</Label>
            <Input
              id="ollamaHost"
              type="text"
              value={apiKeys.ollamaHost}
              onChange={(e) =>
                setApiKeys((prev) => ({ ...prev, ollamaHost: e.target.value }))
              }
              placeholder="http://localhost:11434"
            />
            <p className="text-xs text-zinc-500">
              URL do servidor Ollama local
            </p>
          </div>
        </div>
      </div>

      {/* Security Warning */}
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-amber-400">Aviso de Segurança</p>
            <p className="text-sm text-zinc-400 mt-1">
              As chaves de API são armazenadas localmente no navegador (localStorage).
              Não compartilhe seu computador com outras pessoas se tiver chaves sensíveis salvas.
              Para maior segurança, considere usar variáveis de ambiente no servidor.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          Limpar Todas
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
