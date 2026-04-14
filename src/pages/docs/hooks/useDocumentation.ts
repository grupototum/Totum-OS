/**
 * useDocumentation Hook
 * Manages documentation state, chat history, and Ollama interaction
 */

import { useState, useEffect, useCallback } from 'react';
import { getDocumentationManager, DocPage } from '../lib/documentation';
import { getOllamaClient, OllamaMessage } from '../lib/ollama-client';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export function useDocumentation() {
  const [docs, setDocs] = useState<DocPage[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize documentation
  useEffect(() => {
    const initializeDocs = async () => {
      try {
        setLoading(true);
        const docManager = getDocumentationManager();
        await docManager.load();
        const allDocs = docManager.getAllDocs();
        setDocs(allDocs);

        if (allDocs.length > 0) {
          setSelectedDoc(allDocs[0]);
        }
      } catch (error) {
        console.error('Failed to initialize documentation:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDocs();
  }, []);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };

    getCurrentUser();
  }, []);

  // Check Ollama availability
  useEffect(() => {
    const ollamaClient = getOllamaClient();
    setOllamaAvailable(ollamaClient.isOllamaAvailable());
  }, []);

  // Load chat history from Supabase
  const loadChatHistory = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .eq('context', 'documentation')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data) {
        const messages = data.map((msg: any) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.message,
          timestamp: new Date(msg.created_at),
          sources: msg.sources || [],
        }));

        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, [userId]);

  // Save message to Supabase
  const saveMessage = useCallback(
    async (role: 'user' | 'assistant', content: string, sources?: string[]) => {
      if (!userId) return;

      try {
        await supabase.from('chat_history').insert({
          user_id: userId,
          role,
          message: content,
          context: 'documentation',
          sources: sources || [],
        });
      } catch (error) {
        console.error('Failed to save message:', error);
      }
    },
    [userId]
  );

  // Send chat message
  const sendMessage = useCallback(
    async (message: string) => {
      try {
        setChatLoading(true);

        // Add user message
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: message,
          timestamp: new Date(),
        };

        setChatMessages(prev => [...prev, userMessage]);
        await saveMessage('user', message);

        // Prepare context from documentation
        const docManager = getDocumentationManager();
        const relevantDocs = docManager.search(message);
        const context = relevantDocs
          .slice(0, 3)
          .map(doc => `${doc.title}:\n${doc.content}`)
          .join('\n\n');

        // Create messages for Ollama
        const ollamaMessages: OllamaMessage[] = [
          {
            role: 'system',
            content: `You are a helpful documentation assistant for elizaOS. Answer questions based on the provided documentation. If the answer is not in the documentation, say so clearly.

Documentation context:
${context}`,
          },
          ...chatMessages
            .slice(-5)
            .map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
          {
            role: 'user',
            content: message,
          },
        ];

        // Get response from Ollama
        const ollamaClient = getOllamaClient();
        let response = '';

        response = await ollamaClient.chat(ollamaMessages, (chunk) => {
          // Could update UI in real-time here if needed
        });

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          sources: relevantDocs.map(doc => doc.title),
        };

        setChatMessages(prev => [...prev, assistantMessage]);
        await saveMessage('assistant', response, relevantDocs.map(doc => doc.id));
      } catch (error) {
        console.error('Failed to send message:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, errorMessage]);
      } finally {
        setChatLoading(false);
      }
    },
    [chatMessages, saveMessage]
  );

  const selectDoc = useCallback((doc: DocPage) => {
    setSelectedDoc(doc);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  return {
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
  };
}
