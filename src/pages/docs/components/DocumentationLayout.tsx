/**
 * DocumentationLayout Component
 * Main layout combining documentation browser and chat interface
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BookMarked, MessageSquareText, X } from 'lucide-react';
import { DocumentationBrowser } from './DocumentationBrowser';
import { DocumentationChat } from './DocumentationChat';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/patterns';
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
      else if (m[3]) parts.push(<code key={key++} className="border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{m[3]}</code>);
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="mb-2 mt-6 text-base font-semibold text-foreground">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="mb-3 mt-8 border-b border-border pb-2 text-lg font-semibold text-foreground">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="mb-4 mt-6 text-2xl font-semibold text-foreground">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-3 ml-4 list-disc space-y-1.5">
          {items.map((item, j) => <li key={j} className="pl-1 text-sm leading-relaxed text-muted-foreground">{inlineFormat(item)}</li>)}
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
        <ol key={`ol-${i}`} className="my-3 ml-4 list-decimal space-y-1.5">
          {items.map((item, j) => <li key={j} className="pl-1 text-sm leading-relaxed text-muted-foreground">{inlineFormat(item)}</li>)}
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
        <pre key={`code-${i}`} className="my-4 overflow-x-auto border border-border bg-muted p-4 font-mono text-xs leading-relaxed text-foreground">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-3 border-l-2 border-primary/60 bg-primary/5 py-2 pl-4 text-sm italic text-muted-foreground">
          {inlineFormat(line.slice(2))}
        </blockquote>
      );
    } else if (line.trim() === '' || line.trim() === '---') {
      if (line.trim() === '---') elements.push(<hr key={i} className="my-6 border-border" />);
    } else {
      elements.push(
        <p key={i} className="my-2 text-sm leading-7 text-muted-foreground">
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
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="shrink-0 border-b border-border bg-background p-4 sm:p-5">
        <PageHeader
          eyebrow="Central de conhecimento"
          title="Documentação"
          description="Guias operacionais, referência de agentes e suporte de IA no mesmo padrão visual do command center."
          icon={BookMarked}
          actions={
            <Badge variant={ollamaAvailable ? 'success' : 'warning'}>
              {ollamaAvailable ? 'IA local ativa' : 'Fallback seguro'}
            </Badge>
          }
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Documentation Browser - Desktop (1024px+) */}
      <div className="hidden w-80 flex-shrink-0 flex-col overflow-hidden border-r border-border lg:flex">
        <DocumentationBrowser
          docs={docs}
          selectedDoc={selectedDoc}
          onSelectDoc={onSelectDoc}
          loading={docsLoading}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-0 w-full flex-1 flex-col lg:flex-row">
        {/* Documentation Viewer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-0 flex-1 overflow-y-auto border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8"
        >
          {docsLoading ? (
            <div className="space-y-4 max-w-3xl">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-3/4 animate-pulse bg-muted" />
              ))}
            </div>
          ) : selectedDoc ? (
            <article className="max-w-3xl">
              <div className="mb-6 border border-border bg-card p-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                  Documento
                </p>
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  {selectedDoc.title}
                </h1>
              </div>
              <div>
                <MarkdownContent content={selectedDoc.content} />
              </div>
            </article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center border border-border bg-muted text-primary">
                <BookMarked className="h-7 w-7" />
              </div>
              <p className="mb-2 text-lg font-semibold text-foreground">
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
        <div className="hidden min-h-0 w-96 flex-shrink-0 flex-col overflow-hidden border-l border-border lg:flex">
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
      </div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setShowMobileChat(!showMobileChat)}
        className="fixed bottom-6 right-6 z-40 flex h-16 min-h-[44px] w-16 min-w-[44px] items-center justify-center bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-95 lg:hidden"
        aria-label={showMobileChat ? "Fechar chat" : "Abrir chat"}
      >
        {showMobileChat ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquareText className="h-6 w-6" />
        )}
      </motion.button>

      {/* Mobile Chat Overlay */}
      {showMobileChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setShowMobileChat(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-3/4 bg-background shadow-2xl"
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
