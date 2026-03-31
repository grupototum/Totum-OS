import { Headphones } from "lucide-react";
import AgentChatLayout from "@/components/chat/AgentChatLayout";

export default function AtendenteTotumChat() {
  return (
    <AgentChatLayout
      agent={{
        id: "atendente",
        name: "Atendente Totum",
        icon: Headphones,
        gradient: "from-sky-500 to-blue-500",
        accentColor: "sky",
        description: "Atendimento inteligente com respostas automáticas e encaminhamento.",
      }}
    />
  );
}
