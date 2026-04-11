import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RagDocument } from '@/types/alexandria';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface PortalPOPsProps {
  documents: RagDocument[];
}

const typeLabels: Record<string, { label: string; emoji: string }> = {
  design_system: { label: 'Design System', emoji: '🎨' },
  pops: { label: 'POPs', emoji: '📋' },
  slas: { label: 'SLAs', emoji: '🔒' },
  client_info: { label: 'Informações do Cliente', emoji: '🏢' },
  execution_history: { label: 'Histórico', emoji: '📈' },
};

export default function PortalPOPs({ documents }: PortalPOPsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Busca e Filtro */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar POPs, SLAs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm bg-background"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(typeLabels).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de Documentos */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum documento encontrado</p>
          </Card>
        ) : (
          filteredDocs.map((doc) => {
            const { label, emoji } = typeLabels[doc.type] || {
              label: doc.type,
              emoji: '📄',
            };
            const isExpanded = expandedId === doc.id;

            return (
              <Card
                key={doc.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setExpandedId(isExpanded ? null : doc.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xl">{emoji}</span>
                      <h3 className="font-semibold text-lg">{doc.title}</h3>
                      {doc.is_global && (
                        <Badge variant="secondary">🌍 Global</Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mb-3">
                      {label}
                    </Badge>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Conteúdo:</p>
                          <p className="text-sm whitespace-pre-wrap">{doc.content}</p>
                        </div>
                        <div className="text-xs text-muted-foreground pt-3 border-t">
                          Criado em: {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                          {doc.updated_at && (
                            <span className="ml-4">
                              Atualizado em: {new Date(doc.updated_at).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Resumo */}
      <Card className="p-4 bg-muted">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredDocs.length} de {documents.length} documentos
        </p>
      </Card>
    </div>
  );
}
