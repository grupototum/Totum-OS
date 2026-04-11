import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "./AppSidebar";
import MobileSidebar, { MobileTrigger } from "./MobileSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else {
        setIsReady(true);
      }
    }
  }, [user, loading, navigate]);

  // Mostra loading enquanto verifica autenticação
  if (loading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex gap-[3px] items-end animate-industrial-pulse">
          <div className="w-[5px] h-6 bg-primary rounded-full" />
          <div className="w-[5px] h-4 bg-primary/60 rounded-full" />
          <div className="w-[5px] h-6 bg-primary rounded-full" />
        </div>
      </div>
    );
  }

  // Se não há usuário, não renderiza nada (já vai redirecionar)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop sidebar */}
      {!isMobile && <AppSidebar />}

      {/* Mobile sidebar */}
      {isMobile && (
        <>
          <MobileTrigger onClick={() => setMobileOpen(true)} />
          <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
        </>
      )}

      {/* Main content */}
      <main className={isMobile ? "pt-16" : "ml-[280px]"}>
        {children}
      </main>
    </div>
  );
}
