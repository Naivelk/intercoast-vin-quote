import React from 'react';
import { config as chatbotConfig } from './chatbot.config';
import styled from 'styled-components';

// Styled components for better performance and cleaner code
const SuggestionsContainer = styled.div`
  margin: 0.5rem 0 0.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
`;

const SuggestionsGrid = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  margin: 0.25rem 0;
`;

const SuggestionButton = styled.button<{ color: string }>`
  position: relative;
  overflow: hidden;
  padding: 0.5rem 0.875rem;
  border-radius: 1.125rem 1.125rem 1.125rem 0.25rem;
  font-size: 0.8125rem;
  font-weight: 400;
  text-align: left;
  color: #1f2937;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  min-height: auto;
  box-shadow: none;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
  margin: 0.125rem;
  line-height: 1.25;
  white-space: nowrap;
  max-width: 100%;
  
  &:hover {
    transform: none;
    background: #e5e7eb;
    box-shadow: none;
  }
  
  &:active {
    transform: scale(0.98);
    background: #d1d5db;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f3f4f6;
  }
`;

const MoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 1.125rem;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.25;
  
  &:hover {
    background: #f3f4f6;
    color: #1f2937;
    border-color: #d1d5db;
  }
  
  svg {
    margin-left: 0.375rem;
    width: 0.875rem;
    height: 0.875rem;
    color: #6b7280;
    transition: transform 0.15s ease;
  }
  
  &:hover svg {
    transform: translateX(2px);
  }
`;

interface ChatSuggestionsProps {
  onSelect: (suggestion: string) => void;
  suggestions?: string[];
  disabled?: boolean;
  maxSuggestions?: number;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  onSelect,
  suggestions = chatbotConfig.initialSuggestions,
  disabled = false,
  maxSuggestions = 6,
}) => {
  if (disabled || !suggestions?.length) return null;

  const displaySuggestions = suggestions.slice(0, maxSuggestions);
  const remaining = Math.max(0, suggestions.length - maxSuggestions);

  // Function to get a color based on text content
  const getButtonColor = (text: string): string => {
    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#8b5cf6', // violet-500
      '#f43f5e', // rose-500
      '#f59e0b', // amber-500
      '#06b6d4'  // cyan-500
    ];
    const index = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <SuggestionsContainer>
      <SuggestionsGrid role="group" aria-label="Opciones rápidas">
        {displaySuggestions.map((suggestion, index) => (
          <SuggestionButton
            key={index}
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
            color={getButtonColor(suggestion)}
            title={suggestion}
            aria-label={`Seleccionar: ${suggestion}`}
          >
            {suggestion}
          </SuggestionButton>
        ))}
      </SuggestionsGrid>
      
      {remaining > 0 && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <MoreButton
            onClick={() => onSelect('Ver más opciones')}
            aria-label="Ver más opciones"
          >
            <span>+{remaining} más opciones</span>
            <svg 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </MoreButton>
        </div>
      )}
    </SuggestionsContainer>
  );
};

export default ChatSuggestions;
