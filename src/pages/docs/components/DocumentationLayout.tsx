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
  // Documentation
  docs: DocPage[];
  selectedDoc: DocPage | null;
  docsLoading: boolean;
  onSelectDoc: (doc: DocPage) => void;

  // Chat
  messages: ChatMessage[];
  chatLoading: boolean;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  ollamaAvailable: boolean;
}

export function DocumentationLayout({
  // Documentation
  docs,
  selectedDoc,
  docsLoading,
  onSelectDoc,

  // Chat
  messages,
  chatLoading,
  onSendMessage,
  onClearChat,
  ollamaAvailable,
}: DocumentationLayoutProps) {
  const [showMobileChat, setShowMobileChat] = React.useState(false);

  return (
    <div className="h-full flex bg-zinc-950">
      {/* Documentation Browser - Desktop */}
      <div className="hidden lg:flex w-80 flex-col border-r border-zinc-800">
        <DocumentationBrowser
          docs={docs}
          selectedDoc={selectedDoc}
          onSelectDoc={onSelectDoc}
          loading={docsLoading}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* Documentation Viewer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-6 lg:p-8 lg:border-r lg:border-zinc-800"
        >
          {docsLoading ? (
            <div className="space-y-4 max-w-3xl">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
              ))}
            </div>
          ) : selectedDoc ? (
            <article className="max-w-3xl prose prose-invert prose-sm">
              <h1 className="text-3xl font-bold text-white mb-4">
                {selectedDoc.title}
              </h1>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                {selectedDoc.content}
              </div>
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-lg font-semibold text-white mb-2">
                Welcome to Documentation
              </p>
              <p className="text-sm text-zinc-400 max-w-sm">
                Select a document from the sidebar to get started, or ask the AI
                assistant any questions about elizaOS.
              </p>
            </div>
          )}
        </motion.div>

        {/* Chat Sidebar - Desktop */}
        <div className="hidden lg:flex w-96 flex-col">
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
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#ef233c] hover:bg-[#d91e2f] rounded-full flex items-center justify-center text-white shadow-lg z-40"
        aria-label="Toggle chat"
      >
        {showMobileChat ? (
          <X className="w-6 h-6" />
        ) : (
          <span className="text-xl">💬</span>
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
            className="absolute bottom-0 left-0 right-0 h-3/4 bg-zinc-950 rounded-t-2xl shadow-2xl"
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
