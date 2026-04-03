import { UserCheck } from "lucide-react";
import AgentChatLayout from "@/components/chat/AgentChatLayout";

export default function SdrComercialChat() {
  return (
    <AgentChatLayout
      agent={{
        id: "sdr",
        name: "SDR Comercial",
        icon: UserCheck,
        gradient: "from-rose-500 to-pink-500",
        accentColor: "rose",
        description: "Qualifique leads e automatize o primeiro contato comercial.",
      }}
    />
  );
}
