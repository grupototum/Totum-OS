import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthFormSplitScreen } from "@/components/ui/login";

interface FormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (data: FormValues) => {
    try {
      await signIn(data.email, data.password);
      if (data.rememberMe) {
        localStorage.setItem("totum_remember_email", data.email);
        localStorage.setItem("totum_remember_me", "true");
      } else {
        localStorage.removeItem("totum_remember_email");
        localStorage.removeItem("totum_remember_me");
      }
      toast.success("Bem-vindo à Totum!");
      navigate("/agents");
    } catch (err: any) {
      if (err.approvalStatus === "pending" || err.approvalStatus === "rejected") {
        navigate("/pending-approval", {
          replace: true,
          state: { status: err.approvalStatus, email: err.userEmail || data.email },
        });
        return;
      }
      toast.error(err.message || "Credenciais inválidas.");
      throw err;
    }
  };

  return (
    <AuthFormSplitScreen
      logo={
        <div className="flex items-center gap-3">
          <div className="grid grid-cols-2 w-9 h-9 gap-1">
            <div className="bg-foreground w-full h-full rounded-[4px]" />
            <div className="bg-foreground/70 w-full h-full rounded-[4px]" />
            <div className="bg-foreground/40 w-full h-full rounded-[4px]" />
            <div className="bg-accent w-full h-full rounded-[4px]" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            Totum
          </span>
        </div>
      }
      title="Bem-vindo de volta"
      description="Acesse a central de agentes de IA da Totum"
      imageSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1600"
      imageAlt="Arte digital abstrata com gradientes suaves"
      onSubmit={handleLogin}
      forgotPasswordHref="#/forgot-password"
      createAccountHref="#/signup"
    />
  );
}
