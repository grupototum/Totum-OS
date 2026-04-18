/**
 * DocumentationLayout Component
 * Main layout combining documentation browser and chat interface
 */

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DocumentationBrowser } from './DocumentationBrowser';
import { DocumentationChat } from './DocumentationChat';
import type { DocPage } from '../lib/documentation';
import type { ChatMessage } from '../hooks/useDocumentation';

interface DocumentationLayoutProps {
  docs: DocPage[];
  selectedDoc: DocPage | null;
  docsLoading: boolean;
  onSelectDoc: (doc: DocPage) => void;
  messages: ChatMessage[];
  chatLoading: boolean;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  ollamaAvailable: boolean;
}

export function DocumentationLayout({
  docs,
  selectedDoc,
  docsLoading,
  onSelectDoc,
  messages,
  chatLoading,
  onSendMessage,
  onClearChat,
  ollamaAvailable,
}: DocumentationLayoutProps) {
  const [showMobileChat, setShowMobileChat] = React.useState(false);

  return (
    <div className="h-full flex flex-col lg:flex-row bg-background overflow-hidden">
      {/* Documentation Browser - Desktop (1024px+) */}
      <div className="hidden lg:flex w-80 flex-col flex-shrink-0 border-r border-border overflow-hidden">
        <DocumentationBrowser
          docs={docs}
          selectedDoc={selectedDoc}
          onSelectDoc={onSelectDoc}
          loading={docsLoading}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-0">
        {/* Documentation Viewer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border min-h-0"
        >
          {docsLoading ? (
            <div className="space-y-4 max-w-3xl">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded-none animate-pulse w-3/4" />
              ))}
            </div>
          ) : selectedDoc ? (
            <article className="max-w-3xl">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {selectedDoc.title}
              </h1>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                {selectedDoc.content}
              </div>
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-none bg-muted flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">
                Documentação Totum
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Selecione um documento na sidebar para começar, ou pergunte à IA
                sobre qualquer assunto da plataforma.
              </p>
            </div>
          )}
        </motion.div>

        {/* Chat Sidebar - Desktop (1024px+) */}
        <div className="hidden lg:flex w-96 flex-col flex-shrink-0 border-l border-border overflow-hidden min-h-0">
          <DocumentationChat
            messages={messages}
            loading={chatLoading}
            onSendMessage={onSendMessage}
            onClearChat={onClearChat}
            ollamaAvailable={ollamaAvailable}
          />
        </div>
      </div>

      {/* Mobile Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setShowMobileChat(!showMobileChat)}
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 min-h-[44px] min-w-[44px] bg-primary hover:bg-primary/90 rounded-none flex items-center justify-center text-primary-foreground shadow-lg z-40 transition-all active:scale-95"
        aria-label={showMobileChat ? "Fechar chat" : "Abrir chat"}
      >
        {showMobileChat ? (
          <X className="w-6 h-6" />
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </motion.button>

      {/* Mobile Chat Overlay */}
      {showMobileChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden absolute inset-0 bg-black/80 z-40"
          onClick={() => setShowMobileChat(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-3/4 bg-background rounded-none shadow-2xl"
          >
            <DocumentationChat
              messages={messages}
              loading={chatLoading}
              onSendMessage={onSendMessage}
              onClearChat={onClearChat}
              ollamaAvailable={ollamaAvailable}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
