import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { notifyNewUserPending } from '@/lib/telegram';

/**
 * AuthCallback — handles the OAuth redirect from Google (and other providers).
 * Supabase injects the session via the URL hash/code, then we:
 *   1. Check if the user already has an approval record.
 *   2. New user → create pending record, notify admin, sign out → /pending-approval
 *   3. Pending/rejected → sign out → /pending-approval
 *   4. Approved (or legacy user with no record) → /hub
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const run = async () => {
      try {
        // Supabase SDK auto-processes the URL hash/code on initialisation.
        // Wait for a session to appear (up to ~3 s).
        let session = (await supabase.auth.getSession()).data.session;

        // If not yet available, try explicit code exchange (PKCE flow)
        if (!session) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) throw error;
          session = (await supabase.auth.getSession()).data.session;
        }

        if (!session?.user) throw new Error('Sessão OAuth não encontrada');

        const { user } = session;
        const provider = (user.app_metadata?.provider as string) || 'google';
        const name =
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          user.email ||
          '';

        // Check existing approval record
        const { data: record, error: selectError } = await (supabase as any)
          .from('user_approvals')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (selectError) throw selectError;

        if (!record) {
          // First-time login with this provider — create pending approval
          await (supabase as any).from('user_approvals').insert({
            user_id: user.id,
            email: user.email,
            name,
            status: 'pending',
            provider,
          });

          await notifyNewUserPending(user.email || '', name, provider);
          await supabase.auth.signOut();
          navigate('/pending-approval', { replace: true });
          return;
        }

        if (record.status === 'pending' || record.status === 'rejected') {
          await supabase.auth.signOut();
          navigate('/pending-approval', {
            replace: true,
            state: { status: record.status },
          });
          return;
        }

        // Approved — let them in
        navigate('/hub', { replace: true });
      } catch (err: any) {
        console.error('[AuthCallback]', err);
        setErrorMsg(err.message || 'Erro ao processar login com Google.');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    run();
  }, [navigate]);

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-sm text-zinc-400 max-w-xs text-center">{errorMsg}</p>
        <p className="text-xs text-zinc-600">Redirecionando para o login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-[#ef233c]" />
      <p className="text-sm text-zinc-400">Verificando acesso...</p>
    </div>
  );
}
