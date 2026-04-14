import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/hooks/usePageTransition";
import { PageSkeleton } from "@/components/loading";
import { Plus, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import {
  ClientFilters,
  ClientCard,
  ClientListView,
  ClientDetail,
  anim,
} from "./components";
import {
  useClients,
  useClientFilters,
  useClientSelection,
} from "./hooks";
import type { Client } from "./hooks";

/**
 * ClientsCenter Container Component
 * Manages all client data, filtering, selection, and views
 */
export function ClientsCenterLayout() {
  const navigate = useNavigate();
  const pageTransition = usePageTransition();

  // Data management
  const { clients, loading, deleteClient, updateStatus } = useClients();

  // Filtering & view modes
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    industryFilter,
    setIndustryFilter,
    viewMode,
    setViewMode,
    industries,
    filtered,
  } = useClientFilters(clients);

  // Bulk selection
  const { selected, toggleSelect, toggleAll, clearSelection, isAllSelected } =
    useClientSelection();

  // Detail view
  const [detailClient, setDetailClient] = React.useState<Client | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const handleDetailOpen = (client: Client) => {
    setDetailClient(client);
    setDetailOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <motion.div {...pageTransition}>
          <PageSkeleton />
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          {...anim(0)}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-sans text-2xl font-semibold text-foreground tracking-tight">
              CENTRAL DE CLIENTES
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {clients.length} clientes cadastrados ·{" "}
              {clients.filter((c) => c.status === "active").length} ativos
            </p>
          </div>
          <Button
            onClick={() => navigate("/new-client")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Cliente
          </Button>
        </motion.div>

        {/* Filters */}
        <ClientFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          industryFilter={industryFilter}
          onIndustryChange={setIndustryFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          industries={industries}
          selectedCount={selected.size}
        />

        {/* Empty state */}
        {filtered.length === 0 && (
          <Card className="border-border/40 bg-card/60 p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Altere os filtros ou cadastre um novo cliente
            </p>
          </Card>
        )}

        {/* Views */}
        {viewMode === "list" && filtered.length > 0 && (
          <ClientListView
            clients={filtered}
            selected={selected}
            onToggleSelect={toggleSelect}
            onToggleAll={() =>
              toggleAll(filtered.map((c) => c.id))
            }
            onDelete={deleteClient}
            onStatusChange={updateStatus}
            onDetail={handleDetailOpen}
          />
        )}

        {viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((c, i) => (
                <ClientCard
                  key={c.id}
                  client={c}
                  index={i}
                  onDelete={deleteClient}
                  onStatusChange={updateStatus}
                  onDetail={handleDetailOpen}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Kanban view placeholder */}
        {viewMode === "kanban" && filtered.length > 0 && (
          <motion.div {...anim(2)}>
            <Card className="border-border/40 bg-card/80 p-12 text-center">
              <p className="text-muted-foreground">
                Visualização Kanban em desenvolvimento
              </p>
            </Card>
          </motion.div>
        )}

        {/* Detail Dialog */}
        <ClientDetail
          client={detailClient}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onEdit={(client) => navigate(`/edit-client/${client.id}`)}
        />
      </motion.div>
    </AppLayout>
  );
}
