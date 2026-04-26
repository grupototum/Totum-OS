import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/hooks/usePageTransition";
import { PageSkeleton } from "@/components/loading";
import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/patterns";
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
      <motion.main {...pageTransition} className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" aria-label="Clients center">
        {/* Header */}
        <motion.div {...anim(0)}>
          <PageHeader
            eyebrow="Operações comerciais"
            title="Central de Clientes"
            description={`${clients.length} clientes cadastrados · ${clients.filter((c) => c.status === "active").length} ativos`}
            icon={Building2}
            actions={
              <Button onClick={() => navigate("/new-client")} aria-label="Create new client">
                <Plus className="w-4 h-4 mr-2" /> Novo Cliente
              </Button>
            }
          />
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
          <EmptyState
            icon={Building2}
            title="Nenhum cliente encontrado"
            description="Altere os filtros ou cadastre um novo cliente para preencher a central."
            actionLabel="Novo Cliente"
            onAction={() => navigate("/new-client")}
          />
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
            <EmptyState
              icon={Building2}
              title="Kanban de clientes preparado"
              description="Esta visão será conectada às etapas comerciais; por enquanto use lista ou grid para operar os clientes."
            />
          </motion.div>
        )}

        {/* Detail Dialog */}
        <ClientDetail
          client={detailClient}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onEdit={(client) => navigate(`/edit-client/${client.id}`)}
        />
      </motion.main>
    </AppLayout>
  );
}
