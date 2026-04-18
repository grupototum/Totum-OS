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

/* Simple markdown → JSX renderer (no extra deps) */
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  const inlineFormat = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
    let last = 0, m: RegExpExecArray | null;
    let key = 0;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      if (m[2]) parts.push(<strong key={key++} className="font-semibold text-foreground">{m[2]}</strong>);
      else if (m[3]) parts.push(<code key={key++} className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-foreground">{m[3]}</code>);
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-semibold text-foreground mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-lg font-bold text-foreground mt-8 mb-3 pb-2 border-b border-border">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-3 ml-2">
          {items.map((item, j) => <li key={j} className="text-sm text-muted-foreground">{inlineFormat(item)}</li>)}
        </ul>
      );
      continue;
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-3 ml-2">
          {items.map((item, j) => <li key={j} className="text-sm text-muted-foreground">{inlineFormat(item)}</li>)}
        </ol>
      );
      continue;
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`code-${i}`} className="my-4 p-4 rounded-lg bg-muted overflow-x-auto text-xs font-mono text-foreground border border-border">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-3 pl-4 border-l-2 border-primary/40 text-sm text-muted-foreground italic">
          {inlineFormat(line.slice(2))}
        </blockquote>
      );
    } else if (line.trim() === '' || line.trim() === '---') {
      if (line.trim() === '---') elements.push(<hr key={i} className="my-6 border-border" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed my-2">
          {inlineFormat(line)}
        </p>
      );
    }
    i++;
  }
  return <>{elements}</>;
}

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
              <div className="prose-sm">
                <MarkdownContent content={selectedDoc.content} />
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
