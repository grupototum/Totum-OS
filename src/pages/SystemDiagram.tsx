import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertCircle,
  FolderGit2,
  ChevronRight,
  Star,
  GitFork,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppLayout from "@/components/layout/AppLayout";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  language: string | null;
}

const OWNER = "grupototum";
const REPOS_API = `https://api.github.com/users/${OWNER}/repos?per_page=100&sort=updated`;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SystemDiagram() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filtered, setFiltered] = useState<GitHubRepo[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(false);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(REPOS_API, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const data: GitHubRepo[] = await res.json();
      setRepos(data);
      setFiltered(data);
      if (data.length > 0 && !selected) {
        setSelected(data[0]);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar repositórios");
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      repos.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q)
      )
    );
  }, [search, repos]);

  const gitdiagramUrl = selected
    ? `https://gitdiagram.com/${OWNER}/${selected.name}`
    : null;

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-0">
        {/* ── Sidebar de Projetos ── */}
        <aside className="w-80 border-r bg-card flex flex-col shrink-0">
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-accent" />
              <h2 className="font-semibold text-lg">Diagrama de Sistemas</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Visualize a arquitetura dos projetos da Totum em tempo real.
            </p>
            <div className="relative">
              <Input
                placeholder="Buscar projeto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-8"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4 rotate-[-90deg]" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {filtered.length} projeto{filtered.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={fetchRepos}
                disabled={loading}
                className="text-xs text-accent hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {loading && repos.length === 0 ? (
              <div className="p-8 flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Carregando repositórios...</span>
              </div>
            ) : error ? (
              <div className="p-6 flex flex-col items-center gap-2 text-destructive">
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm text-center">{error}</span>
                <Button size="sm" variant="outline" onClick={fetchRepos}>
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                <AnimatePresence initial={false}>
                  {filtered.map((repo) => {
                    const isActive = selected?.id === repo.id;
                    return (
                      <motion.button
                        key={repo.id}
                        layout
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        onClick={() => {
                          setSelected(repo);
                          setIframeLoading(true);
                        }}
                        className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors group ${
                          isActive
                            ? "bg-accent/10 border border-accent/20"
                            : "hover:bg-accent/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <FolderGit2
                            className={`h-4 w-4 mt-0.5 shrink-0 ${
                              isActive ? "text-accent" : "text-muted-foreground"
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-sm font-medium truncate ${
                                  isActive ? "text-accent" : "text-foreground"
                                }`}
                              >
                                {repo.name}
                              </span>
                              {isActive && (
                                <ChevronRight className="h-3.5 w-3.5 text-accent shrink-0" />
                              )}
                            </div>
                            {repo.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {repo.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1.5">
                              {repo.language && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                  {repo.language}
                                </Badge>
                              )}
                              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Star className="h-3 w-3" />
                                {repo.stargazers_count}
                              </span>
                              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <GitFork className="h-3 w-3" />
                                {repo.forks_count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>

          <div className="p-3 border-t text-[10px] text-muted-foreground text-center">
            Dados atualizados em tempo real via GitHub API
          </div>
        </aside>

        {/* ── Painel de Diagrama ── */}
        <main className="flex-1 flex flex-col min-w-0 bg-background">
          {selected ? (
            <>
              {/* Header */}
              <div className="h-14 border-b px-4 flex items-center justify-between shrink-0 bg-card">
                <div className="flex items-center gap-3 min-w-0">
                  <GitBranch className="h-4 w-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold truncate">
                      {OWNER}/{selected.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Atualizado em {formatDate(selected.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIframeLoading(true)}
                    className="gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Recarregar diagrama
                  </Button>
                  <a
                    href={gitdiagramUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="ghost" className="gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Abrir no GitDiagram
                    </Button>
                  </a>
                  <a
                    href={selected.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="ghost" className="gap-1.5">
                      <GitBranch className="h-3.5 w-3.5" />
                      GitHub
                    </Button>
                  </a>
                </div>
              </div>

              {/* Iframe */}
              <div className="flex-1 relative">
                {iframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <span className="text-sm text-muted-foreground">
                      Gerando diagrama de arquitetura...
                    </span>
                    <span className="text-xs text-muted-foreground max-w-md text-center">
                      O GitDiagram está analisando a estrutura do repositório e gerando o diagrama interativo. Isso pode levar alguns segundos.
                    </span>
                  </div>
                )}
                <iframe
                  key={selected.id}
                  src={gitdiagramUrl!}
                  title={`Diagrama ${selected.name}`}
                  className="w-full h-full border-0"
                  onLoad={() => setIframeLoading(false)}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <LayoutTemplate className="h-12 w-12 opacity-30" />
              <p className="text-sm">Selecione um projeto ao lado para visualizar seu diagrama</p>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
