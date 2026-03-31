import { Megaphone } from "lucide-react";
import AgentChatLayout from "@/components/chat/AgentChatLayout";

export default function RadarAnunciosChat() {
  return (
    <AgentChatLayout
      agent={{
        id: "ads-extractor",
        name: "Radar de Anúncios",
        icon: Megaphone,
        gradient: "from-amber-500 to-yellow-500",
        accentColor: "amber",
        description: "Extraia e analise anúncios de concorrentes com inteligência competitiva.",
      }}
    />
  );
}
