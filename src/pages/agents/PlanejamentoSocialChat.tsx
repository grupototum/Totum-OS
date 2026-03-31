import { Share2 } from "lucide-react";
import AgentChatLayout from "@/components/chat/AgentChatLayout";

export default function PlanejamentoSocialChat() {
  return (
    <AgentChatLayout
      agent={{
        id: "social",
        name: "Planejamento Social",
        icon: Share2,
        gradient: "from-violet-500 to-purple-500",
        accentColor: "violet",
        description: "Planeje e organize conteúdo para redes sociais com calendário editorial.",
      }}
    />
  );
}
