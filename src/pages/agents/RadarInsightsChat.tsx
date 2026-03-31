import { Search } from "lucide-react";
import AgentChatLayout from "@/components/chat/AgentChatLayout";

export default function RadarInsightsChat() {
  return (
    <AgentChatLayout
      agent={{
        id: "radar",
        name: "Radar de Insights",
        icon: Search,
        gradient: "from-orange-500 to-amber-500",
        accentColor: "orange",
        description: "Analise conteúdos e extraia insights estratégicos por departamento automaticamente.",
      }}
    />
  );
}
