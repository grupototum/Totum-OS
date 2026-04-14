/**
 * Documentation Page
 * Main page for documentation browsing and AI chat assistance
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDocumentation } from './hooks/useDocumentation';
import { DocumentationLayout } from './components/DocumentationLayout';

export function DocsPage() {
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

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-zinc-950"
    >
      <DocumentationLayout
        // Documentation props
        docs={docs}
        selectedDoc={selectedDoc}
        docsLoading={loading}
        onSelectDoc={selectDoc}
        // Chat props
        messages={chatMessages}
        chatLoading={chatLoading}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        ollamaAvailable={ollamaAvailable}
      />
    </motion.div>
  );
}

export default DocsPage;
