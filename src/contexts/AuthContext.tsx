import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifyNewUserPending } from "@/lib/telegram";

type ApprovalStatus = "pending" | "approved" | "rejected" | null;

interface SignUpResult {
  pending: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the user's approval status.
 * Returns null if no record exists (legacy user — treated as approved).
 */
async function fetchApprovalStatus(userId: string): Promise<ApprovalStatus> {
  const { data } = await (supabase as any)
    .from("user_approvals")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.status ?? null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── signIn ──────────────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Auto-confirm email workaround (legacy behaviour)
    if (error?.message?.toLowerCase().includes("email not confirmed")) {
      toast.info("Confirmando email automaticamente...");
      try {
        const res = await fetch("/api/admin/confirm-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const result = await res.json();
        if (result.success) {
          toast.success("Email confirmado! Tentando login novamente...");
          const { data: retryData, error: retryErr } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (retryErr) throw retryErr;
          if (retryData.user) await guardApproval(retryData.user.id);
        } else {
          throw new Error(
            "Não foi possível confirmar o email. Entre em contato com o administrador."
          );
        }
      } catch (err) {
        throw err;
      }
      return;
    }

    if (error) throw error;

    // Approval gate
    if (data.user) await guardApproval(data.user.id, email);
  };

  // ── signUp ──────────────────────────────────────────────────────────────────
  const signUp = async (
    email: string,
    password: string,
    name?: string
  ): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: name ? { full_name: name } : undefined,
      },
    });
    if (error) throw error;

    if (data.user) {
      // Create pending approval record
      await (supabase as any).from("user_approvals").insert({
        user_id: data.user.id,
        email,
        name: name || null,
        status: "pending",
        provider: "email",
      });

      // Notify admin via Telegram
      await notifyNewUserPending(email, name, "email");

      // Sign out immediately — they must wait for approval
      await supabase.auth.signOut();
    }

    return { pending: true };
  };

  // ── signOut ─────────────────────────────────────────────────────────────────
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

// ─── Internal guard (throws on pending/rejected) ──────────────────────────────
async function guardApproval(userId: string, email?: string): Promise<void> {
  const status = await fetchApprovalStatus(userId);

  if (status === "pending") {
    await supabase.auth.signOut();
    const err = new Error(
      "Seu cadastro ainda está aguardando aprovação do administrador. Você será notificado quando o acesso for liberado."
    );
    (err as any).approvalStatus = "pending";
    if (email) (err as any).userEmail = email;
    throw err;
  }

  if (status === "rejected") {
    await supabase.auth.signOut();
    const err = new Error(
      "Seu cadastro foi rejeitado. Entre em contato com o administrador para mais informações."
    );
    (err as any).approvalStatus = "rejected";
    if (email) (err as any).userEmail = email;
    throw err;
  }
  // null (no record) = legacy user, approved
}
