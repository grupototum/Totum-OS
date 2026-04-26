/**
 * DocumentationBrowser Component
 * Left sidebar navigation for browsing documentation pages
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, FileText } from 'lucide-react';
import type { DocPage } from '../lib/documentation';

interface DocumentationBrowserProps {
  docs: DocPage[];
  selectedDoc: DocPage | null;
  onSelectDoc: (doc: DocPage) => void;
  loading: boolean;
}

export function DocumentationBrowser({
  docs,
  selectedDoc,
  onSelectDoc,
  loading,
}: DocumentationBrowserProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-card" role="navigation" aria-label="Navegação da documentação">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="w-4 h-4 text-primary" />
          Documentação
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Base de conhecimento Totum
        </p>
      </div>

      {/* Doc List */}
      <div className="flex-1 overflow-y-auto p-2" role="list">
        {loading ? (
          <div className="space-y-2 p-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse bg-muted"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            {docs.map((doc, index) => (
              <motion.button
                key={doc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectDoc(doc)}
                className={`group flex min-h-[48px] w-full items-center justify-between border px-3 py-3 text-left text-sm transition-all duration-200 active:scale-[0.99] ${
                  selectedDoc?.id === doc.id
                    ? 'border-primary/60 bg-primary/10 text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground'
                }`}
                aria-current={selectedDoc?.id === doc.id ? 'page' : undefined}
                aria-label={`Ver documentação ${doc.title}`}
              >
                <FileText className="mr-2 h-4 w-4 shrink-0 text-primary/80" />
                <span className="flex-1 truncate font-medium">{doc.title}</span>
                {selectedDoc?.id === doc.id && (
                  <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0 text-primary" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-background/50 p-3 text-xs text-muted-foreground">
        <p>Clique em um doc para visualizar ou pergunte à IA</p>
      </div>
    </div>
  );
}
