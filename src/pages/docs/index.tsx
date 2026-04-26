/**
 * Documentation Page
 * Main page for documentation browsing and AI chat assistance
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { PageSkeleton } from '@/components/loading/PageSkeleton';
import { useDocumentation } from './hooks/useDocumentation';
import { DocumentationLayout } from './components/DocumentationLayout';

export default function DocsPage() {
  const {
    // Documentation
    docs,
    selectedDoc,
    selectDoc,
    loading,

    // Chat
    chatMessages,
    chatLoading,
    sendMessage,
    clearChat,
    loadChatHistory,
    ollamaAvailable,
  } = useDocumentation();

  const [isReady, setIsReady] = useState(false);

  // Load chat history on mount and mark as ready
  useEffect(() => {
    loadChatHistory();
    // Force FCP by marking ready after docs load
    if (docs.length > 0) {
      setIsReady(true);
    }
  }, [loadChatHistory, docs]);

  // Fallback: mark ready after timeout to prevent infinite loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady && loading) {
    return (
      <AppLayout>
        <PageSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="h-[calc(100vh-4rem)] overflow-hidden bg-background"
      >
        <DocumentationLayout
          docs={docs}
          selectedDoc={selectedDoc}
          docsLoading={loading}
          onSelectDoc={selectDoc}
          messages={chatMessages}
          chatLoading={chatLoading}
          onSendMessage={sendMessage}
          onClearChat={clearChat}
          ollamaAvailable={ollamaAvailable}
        />
      </motion.div>
    </AppLayout>
  );
}
