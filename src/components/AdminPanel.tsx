import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Users,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Loader2,
  Crown,
  UserCog,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

const ROLE_CONFIG = {
  admin: { label: "Admin", icon: Crown, color: "text-amber-500" },
  moderator: { label: "Moderador", icon: ShieldCheck, color: "text-blue-400" },
  user: { label: "Usuário", icon: User, color: "text-muted-foreground" },
} as const;

export default function AdminPanel() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users via edge function or RPC
      // Since we can't query auth.users from client, we'll use the roles table
      // and show users that have roles assigned
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Group roles by user_id
      const userMap = new Map<string, string[]>();
      rolesData?.forEach((r: any) => {
        const existing = userMap.get(r.user_id) || [];
        existing.push(r.role);
        userMap.set(r.user_id, existing);
      });

      // We'll show user_ids with their roles
      // For email we need a profiles table or edge function
      // For now, show user_id and roles
      const userList: UserWithRoles[] = Array.from(userMap.entries()).map(
        ([id, roles]) => ({
          id,
          email: "", // Will be populated if we add profiles
          created_at: "",
          roles,
        })
      );

      setUsers(userList);
    } catch (err: any) {
      toast.error("Erro ao carregar usuários: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addRole = async (userId: string, role: string) => {
    setActionLoading(`${userId}-add-${role}`);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as any });
      if (error) throw error;
      toast.success(`Role "${role}" adicionada com sucesso.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const removeRole = async (userId: string, role: string) => {
    setActionLoading(`${userId}-rm-${role}`);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw error;
      toast.success(`Role "${role}" removida.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Header */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors rounded-t-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h2 className="font-heading font-bold text-foreground text-sm">
                  Painel de Administração
                </h2>
                <p className="text-xs text-muted-foreground">
                  Gerencie usuários e permissões
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {users.length} usuário{users.length !== 1 ? "s" : ""}
              </span>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {/* Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3">
                  <div className="h-px bg-border/60" />

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Nenhum usuário com permissões atribuídas
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {users.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40 hover:border-border/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              <UserCog className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
                                {u.id.slice(0, 8)}...
                              </p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {u.roles.map((role) => {
                                  const config =
                                    ROLE_CONFIG[
                                      role as keyof typeof ROLE_CONFIG
                                    ];
                                  const Icon = config?.icon || User;
                                  return (
                                    <span
                                      key={role}
                                      className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-background border border-border/60"
                                    >
                                      <Icon
                                        className={`w-3 h-3 ${config?.color || ""}`}
                                      />
                                      {config?.label || role}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Add missing roles */}
                            {(["admin", "moderator", "user"] as const)
                              .filter((r) => !u.roles.includes(r))
                              .map((role) => (
                                <button
                                  key={role}
                                  onClick={() => addRole(u.id, role)}
                                  disabled={actionLoading !== null}
                                  className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                                  title={`Adicionar ${ROLE_CONFIG[role].label}`}
                                >
                                  {actionLoading ===
                                  `${u.id}-add-${role}` ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Plus className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              ))}

                            {/* Remove roles (except if only one admin) */}
                            {u.roles.map((role) => (
                              <button
                                key={`rm-${role}`}
                                onClick={() => removeRole(u.id, role)}
                                disabled={actionLoading !== null}
                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                                title={`Remover ${ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]?.label || role}`}
                              >
                                {actionLoading ===
                                `${u.id}-rm-${role}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
