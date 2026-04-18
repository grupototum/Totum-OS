import { WifiOff } from "lucide-react";

export default function OfflineFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <WifiOff className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-xl font-semibold text-foreground mb-2">
        Você está offline
      </h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Não foi possível conectar à internet. Verifique sua conexão e tente novamente.
        Algumas funcionalidades podem estar indisponíveis offline.
      </p>
    </div>
  );
}
