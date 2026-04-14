import { useState, useCallback } from "react";

/**
 * Hook for managing bulk client selection
 */
export function useClientSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback((ids: string[]) => {
    setSelected((prev) => {
      if (prev.size === ids.length) {
        return new Set();
      }
      return new Set(ids);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
  }, []);

  return {
    selected,
    toggleSelect,
    toggleAll,
    clearSelection,
    isAllSelected: (ids: string[]) => selected.size === ids.length && ids.length > 0,
  };
}
