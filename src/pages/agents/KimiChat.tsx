import { Bot } from "lucide-react";
import AgentChatLayout from "@/components/chat/AgentChatLayout";

export default function KimiChat() {
  return (
    <AgentChatLayout
      agent={{
        id: "kimi",
        name: "Kimi",
        icon: Bot,
        gradient: "from-cyan-500 to-sky-500",
        accentColor: "cyan",
        description: "Assistente de IA multiuso para tarefas diversas e automações.",
      }}
    />
  );
}
