'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useAssistantStore, type Message } from '@/store/useAssistantStore';
import ChatBubble from './ChatBubble';

export default function AIAssistant() {
  const { isOpen, messages, isStreaming, toggleOpen, addMessage, setStreaming } =
    useAssistantStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: data.id ?? crypto.randomUUID(),
        role: 'assistant',
        content: data.content ?? 'Sorry, I couldn\'t process that.',
        timestamp: new Date(),
      };
      addMessage(assistantMsg);
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date(),
      });
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        id="ai-assistant-toggle"
        onClick={toggleOpen}
        data-cursor-hover
        className="fixed bottom-6 right-6 z-[9980] w-14 h-14 rounded-full font-bold text-sm flex items-center justify-center shadow-2xl glow-accent transition-all"
        style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '✦'}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-panel"
            className="fixed bottom-24 right-6 z-[9975] w-[360px] max-w-[calc(100vw-24px)] rounded-3xl glass-strong flex flex-col overflow-hidden shadow-2xl"
            style={{
              maxHeight: '520px',
              border: '1px solid var(--border)',
            }}
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold animate-pulse-glow"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                ✦
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  NexVerse AI
                </p>
                <p className="text-xs" style={{ color: 'var(--active)' }}>
                  {isStreaming ? 'Thinking…' : '● Online'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="text-4xl mb-3">✦</div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Hi, I&apos;m your audio advisor
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Ask me anything about our headphones, features, or which model fits your lifestyle.
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isStreaming && (
                <div className="flex gap-1 px-3 py-2 glass rounded-2xl rounded-bl-sm w-fit">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--accent-glow)' }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-4 py-3 border-t flex gap-2 items-center"
              style={{ borderColor: 'var(--border)' }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about headphones…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-secondary"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Chat message input"
                disabled={isStreaming}
              />
              <button
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
                data-cursor-hover
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all disabled:opacity-30"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
