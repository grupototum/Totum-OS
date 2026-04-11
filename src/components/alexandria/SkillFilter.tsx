import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SkillFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function SkillFilter({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  categories,
}: SkillFilterProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar skills..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <select
        value={filterCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border rounded-md text-sm bg-background"
      >
        <option value="">Todas as categorias</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
