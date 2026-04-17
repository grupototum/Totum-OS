import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "./AppSidebar";
import MobileSidebar, { MobileTrigger } from "./MobileSidebar";
import { OnboardingModal, useOnboarding } from "@/components/onboarding/OnboardingModal";
import { SidebarProvider, useSidebarCollapse } from "@/contexts/SidebarContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

// Inner component that reads collapsed state after Provider is mounted
function AppLayoutInner({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { showOnboarding, closeOnboarding } = useOnboarding();
  const { collapsed } = useSidebarCollapse();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else {
        setIsReady(true);
      }
    }
  }, [user, loading, navigate]);

  if (loading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex gap-[3px] items-end animate-industrial-pulse">
          <div className="w-[5px] h-6 bg-primary rounded-full" />
          <div className="w-[5px] h-4 bg-primary/60 rounded-full" />
          <div className="w-[5px] h-6 bg-primary rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Sync main margin with sidebar width (transitions match sidebar's 300ms ease-in-out)
  const mainClass = isMobile
    ? "pt-16"
    : collapsed
    ? "ml-[72px] transition-[margin] duration-300 ease-in-out"
    : "ml-[260px] transition-[margin] duration-300 ease-in-out";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      {!isMobile && <AppSidebar />}

      {/* Mobile sidebar */}
      {isMobile && (
        <>
          <MobileTrigger onClick={() => setMobileOpen(true)} />
          <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
        </>
      )}

      {/* Onboarding wizard — shown once on first login */}
      <OnboardingModal open={showOnboarding} onClose={closeOnboarding} />

      {/* Main content — margin responds to sidebar collapsed state */}
      <main className={mainClass}>
        {children}
      </main>
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </SidebarProvider>
  );
}
