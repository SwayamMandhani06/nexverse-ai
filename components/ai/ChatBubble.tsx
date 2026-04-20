'use client';

import { motion } from 'framer-motion';
import type { Message } from '@/store/useAssistantStore';

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-2xl rounded-br-sm'
            : 'rounded-2xl rounded-bl-sm glass'
        }`}
        style={{
          backgroundColor: isUser ? 'var(--accent)' : undefined,
          color: isUser ? 'white' : 'var(--text-primary)',
        }}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
