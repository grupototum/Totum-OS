import { TrendingUp } from "lucide-react";
import AgentChatLayout from "@/components/chat/AgentChatLayout";

export default function GestorTrafegoChat() {
  return (
    <AgentChatLayout
      agent={{
        id: "gestor",
        name: "Gestor de Tráfego",
        icon: TrendingUp,
        gradient: "from-emerald-500 to-teal-500",
        accentColor: "emerald",
        description: "Gerencie campanhas de tráfego pago com relatórios e otimizações inteligentes.",
      }}
    />
  );
}
