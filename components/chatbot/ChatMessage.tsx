import React from 'react';
import { ChatMessage as MessageType } from './chatbot.types';
import { config as chatbotConfig } from './chatbot.config';
import { EvaMood } from './EvaAvatar';

interface ChatMessageProps {
  message: MessageType;
  isAssistantSpeaking?: boolean;
  assistantMood?: EvaMood;
  reducedMotion?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isAssistantSpeaking, assistantMood = 'neutral', reducedMotion }) => {
  const isUser = message.role === 'user';
  const { theme } = chatbotConfig;

  const containerStyles = `flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-2`;
  const bubbleBase = 'px-4 py-2 rounded-2xl max-w-[85%] leading-relaxed';
  const userBubble = 'bg-sky-600 text-white';
  const botBubble = 'bg-slate-100 text-slate-800';

  return (
    <div className={containerStyles}>
      {/* No avatar next to assistant messages to keep bubbles clean */}
      <div 
        className={`${bubbleBase} ${isUser ? userBubble : botBubble}`}
        style={{ whiteSpace: 'pre-line' }}
      >
        {message.content}
      </div>
      {message.isLoading && (
        <div className="flex space-x-1 items-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
