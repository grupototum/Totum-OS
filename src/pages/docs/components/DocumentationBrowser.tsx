/**
 * DocumentationBrowser Component
 * Left sidebar navigation for browsing documentation pages
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-zinc-900 border-r border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-black/50 sticky top-0 z-10">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#ef233c]" />
          Documentation
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          elizaOS Knowledge Base
        </p>
      </div>

      {/* Doc List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-zinc-800 rounded animate-pulse"
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
                className={`w-full px-3 py-3 min-h-[44px] rounded text-left text-sm transition-all duration-200 flex items-center justify-between group active:scale-95 ${
                  selectedDoc?.id === doc.id
                    ? 'bg-[#ef233c] text-white'
                    : 'text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                <span className="font-medium truncate flex-1">{doc.title}</span>
                {selectedDoc?.id === doc.id && (
                  <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800 bg-black/50 text-xs text-zinc-500">
        <p>Click a doc to view or ask AI about it</p>
      </div>
    </div>
  );
}
