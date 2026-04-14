import { useState, useMemo } from "react";
import type { Client } from "./useClients";

export type ViewMode = "list" | "grid" | "kanban";

/**
 * Hook for managing client filtering and view modes
 */
export function useClientFilters(clients: Client[]) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Extract unique industries from clients
  const industries = useMemo(
    () =>
      [...new Set(clients.map((c) => c.industry).filter(Boolean))] as string[],
    [clients]
  );

  // Filter clients based on all criteria
  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.company_name.toLowerCase().includes(q) ||
        (c.cnpj ?? "").includes(q) ||
        (c.contact_name ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchIndustry =
        industryFilter === "all" || c.industry === industryFilter;
      return matchSearch && matchStatus && matchIndustry;
    });
  }, [clients, search, statusFilter, industryFilter]);

  return {
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
  };
}
