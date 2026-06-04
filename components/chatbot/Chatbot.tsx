import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChatBubbleLeftRightIcon, ArrowPathIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import EvaAvatar from './EvaAvatar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';
import { ChatMessage as MessageType, ChatbotContextType } from './chatbot.types';
import { config as chatbotConfig } from './chatbot.config';
import { useChatbot } from './chatbot.hooks';
import { onOpenChatbot, onAssistantMood } from './eventBus';
import InputPortal from '../eva/InputPortal';

interface ChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  initialMessage?: string;
  embedded?: boolean; // render inline without fixed container or floating button
}

const Chatbot: React.FC<ChatbotProps> = ({
  isOpen: externalIsOpen = false,
  onClose,
  onOpen,
  initialMessage,
  embedded = false,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const isControlled = onClose !== undefined && onOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : isInternalOpen;

  const {
    messages,
    isLoading,
    sendMessage,
    startNewConversation,
    userData,
    isOpen: isChatOpen,
    toggleChat: toggleChatHook,
    announce,
  } = useChatbot(initialMessage);

  // Preferencias
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('EVA_TTS_ENABLED') === '1'; } catch { return false; }
  });
  const [reducedMotionEnabled, setReducedMotionEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('EVA_REDUCED_MOTION') === '1'; } catch { return false; }
  });

  // Mostrar sugerencias iniciales solo si no hay mensajes
  const showInitialSuggestions = messages.length === 0;

  // Obtener el último mensaje del asistente
  const lastAssistantMessage = messages.length > 0 && messages[messages.length - 1].role === 'assistant' 
    ? messages[messages.length - 1] 
    : null;
    
  // Verificar si el último mensaje del asistente tiene opciones
  const hasMessageOptions = Boolean(lastAssistantMessage?.metadata?.options?.length);
  
  // Función segura para obtener opciones de mensajes
  const getMessageOptions = (): string[] => {
    if (!lastAssistantMessage?.metadata?.options) return [];
    return [...lastAssistantMessage.metadata.options];
  };
  
  // Obtener sugerencias iniciales como array mutable
  const initialSuggestions = [...chatbotConfig.initialSuggestions];

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Reduced motion detector
  const prefersReducedMotion = useMemo(() => {
    if (reducedMotionEnabled) return true;
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
  }, [reducedMotionEnabled]);

  // Mood mapping for Eva
  const [moodOverride, setMoodOverride] = useState<'neutral'|'thinking'|'happy'|'concerned'|null>(null);
  useEffect(() => {
    const unsub = onAssistantMood(({ mood }) => {
      setMoodOverride(mood);
      // Clear after a short while to return to heuristic mood
      setTimeout(() => setMoodOverride(null), 4000);
    });
    return unsub;
  }, []);

  const assistantMood = useMemo(() => {
    if (moodOverride) return moodOverride;
    if (isLoading) return 'thinking' as const;
    const content = (lastAssistantMessage?.content || '').toLowerCase();
    if (content.includes('precio estimado') || content.includes('perfecto') || content.includes('gracias')) return 'happy' as const;
    if (content.includes('error') || content.includes('no pude') || content.includes('inválid') || content.includes('invalido')) return 'concerned' as const;
    return 'neutral' as const;
  }, [isLoading, lastAssistantMessage, moodOverride]);

  // TTS: speak assistant messages when enabled
  useEffect(() => {
    if (!ttsEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return;
    const type = last.metadata?.type || 'text';
    // Solo leer mensajes de texto o quote (no menús de opciones)
    if (!(type === 'text' || type === 'quote')) return;
    const text = (last.content || '').trim();
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    // Prefer cheerful female Spanish voices
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const esVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('es'));
      const prefNames = [
        'Google español de Estados Unidos',
        'Google español',
        'Microsoft Sabina',
        'Microsoft Elena',
        'Microsoft Helena',
      ];
      let chosen = null as SpeechSynthesisVoice | null;
      // 1) Preferred names
      for (const name of prefNames) {
        const v = esVoices.find(vv => (vv.name || '').toLowerCase().includes(name.toLowerCase()));
        if (v) { chosen = v; break; }
      }
      // 2) Any es voice
      if (!chosen) chosen = esVoices[0] || null;
      // 3) Fallback first voice
      if (!chosen) chosen = voices[0] || null;
      if (chosen) utter.voice = chosen;
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = () => pickVoice();
    // Cheerful tone
    utter.pitch = 1.1;
    utter.rate = 1.03;
    try { window.speechSynthesis.cancel(); } catch {}
    window.speechSynthesis.speak(utter);
  }, [messages, ttsEnabled]);

  // Sincronizar el estado de apertura/cierre con el hook
  useEffect(() => {
    if (isControlled) return;
    
    if (isChatOpen && !isOpen) {
      setIsInternalOpen(true);
    } else if (!isChatOpen && isOpen) {
      setIsInternalOpen(false);
    }
  }, [isChatOpen, isOpen, isControlled]);

  // Efecto para hacer scroll al final de los mensajes
  useEffect(() => {
    const endEl = messagesEndRef.current;
    const container = messagesScrollRef.current;
    if (endEl && container) {
      // Desplazar el contenedor hasta el final
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Enfocar el input tras cada mensaje del asistente
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && last.role === 'assistant') {
      setTimeout(() => {
        const el = document.querySelector('[data-eva-input="1"]') as HTMLElement | null;
        el?.focus();
      }, 50);
    }
  }, [messages]);

  // Reset handler: listen for global event to restart the chat
  useEffect(() => {
    const onReset = () => {
      try { startNewConversation(); } catch {}
    };
    window.addEventListener('chatbot:reset', onReset);
    return () => window.removeEventListener('chatbot:reset', onReset);
  }, [startNewConversation]);

  // Efecto para detectar clics fuera del chat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chatContainerRef.current && 
        !chatContainerRef.current.contains(event.target as Node) &&
        isOpen &&
        !isMinimized
      ) {
        handleMinimize();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMinimized]);

  // Suscribirse a eventos externos para abrir el chat y anunciar un mensaje
  useEffect(() => {
    const unsubscribe = onOpenChatbot(({ message }) => {
      const inConversation = messages.length > 0;
      if (!isOpen) {
        // Sincroniza estado del hook y del componente
        toggleChatHook();
      }
      // Solo anunciar si no hay conversación activa (evita interrumpir el flujo)
      if (message && !inConversation) {
        announce?.(message, { type: 'text' });
      }
    });
    return unsubscribe;
  }, [isOpen, toggleChatHook, announce, messages.length]);

  const handleToggleChat = () => {
    if (isControlled) {
      if (isOpen) {
        onClose?.();
      } else {
        onOpen?.();
      }
    } else {
      toggleChatHook();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleNewChat = () => {
    startNewConversation();
  };

  // Estilos dinámicos basados en el tema
  const { theme } = chatbotConfig;
  const chatHeaderStyle = {
    backgroundColor: theme.primaryColor,
    color: theme.userTextColor,
  };

  const chatButtonStyle = {
    backgroundColor: theme.primaryColor,
    color: theme.userTextColor,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  // Animaciones
  const chatVariants = {
    open: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring' as const, 
        damping: 25, 
        stiffness: 500 
      } 
    },
    closed: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      transition: { 
        type: 'spring' as const, 
        damping: 25, 
        stiffness: 500 
      } 
    },
    minimized: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring' as const, 
        damping: 25, 
        stiffness: 500 
      } 
    }
  } as const;

  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
    },
    tap: { 
      scale: 0.95 
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  // Embedded mode: render only the inner content (messages + input) to be wrapped by a parent dock
  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesScrollRef as any} role="status" aria-live="polite">
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ChatMessage 
                message={message} 
                isAssistantSpeaking={message.role === 'assistant' && Boolean(message.isLoading || isLoading)}
                assistantMood={assistantMood as any}
                reducedMotion={prefersReducedMotion}
              />
            </React.Fragment>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-gray-100 rounded-2xl max-w-[85%] flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input portalized into the dock slot */}
        <InputPortal targetId="eva-input-slot">
          <div className="relative" style={{ pointerEvents: 'auto' }}>
            <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} placeholder="Escribe tu mensaje..." />
            {showInitialSuggestions && (
              <div className="p-2">
                <ChatSuggestions onSelect={handleSendMessage} suggestions={initialSuggestions} />
              </div>
            )}
            {hasMessageOptions && (
              <div className="p-2 border-t border-gray-100">
                <ChatSuggestions onSelect={handleSendMessage} suggestions={getMessageOptions()} />
              </div>
            )}
            <p className="text-[11px] text-gray-500 text-center mt-1">
              Eva es una IA. Puede cometer errores. Revisa la información importante.
            </p>
          </div>
        </InputPortal>
      </div>
    );
  }
  
  // Si el chat está minimizado, mostramos solo el botón flotante
  if (isMinimized) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
      >
        <motion.button
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
          style={chatButtonStyle}
          onClick={handleMaximize}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={!isOpen ? 'pulse' : 'initial'}
        >
          <EvaAvatar size={28} isSpeaking={false} mood={assistantMood as any} reducedMotion={prefersReducedMotion} />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              pointerEvents: 'auto', // Ensure overlay doesn't block clicks
            }}
          />
        )}
      </AnimatePresence>

      {/* Chat Container */}
      <motion.div
        ref={chatContainerRef}
        className="fixed right-4 bottom-24 w-[min(100vw-1rem,420px)] h-[70vh] max-h-[720px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden
                   sm:right-6 sm:bottom-24
                   xs:right-2 xs:bottom-20
                   md:w-[420px]
                   
                   
                   
                   "
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={chatVariants}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          pointerEvents: 'auto', // Ensure chat container is interactive
        }}
      >
        {/* Chat Header */}
        <div 
          className="flex items-center justify-between p-4 rounded-t-2xl"
          style={chatHeaderStyle}
        >
          <div className="flex items-center">
            <div className="mr-2">
              <EvaAvatar size={32} isSpeaking={isLoading} mood={assistantMood as any} reducedMotion={prefersReducedMotion} />
            </div>
            <h2 className="text-lg font-semibold">Eva - Asistente Virtual</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewChat}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              title="Nueva conversación"
            >
              <ArrowPathIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => {
                const next = !ttsEnabled; setTtsEnabled(next); try { localStorage.setItem('EVA_TTS_ENABLED', next ? '1' : '0'); } catch {}
              }}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              title={ttsEnabled ? 'Desactivar voz' : 'Activar voz'}
            >
              {ttsEnabled ? <SpeakerWaveIcon className="w-5 h-5 text-white" /> : <SpeakerXMarkIcon className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={() => { const next = !reducedMotionEnabled; setReducedMotionEnabled(next); try { localStorage.setItem('EVA_REDUCED_MOTION', next ? '1' : '0'); } catch {} }}
              className="px-2 py-1 text-xs rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              title={reducedMotionEnabled ? 'Animaciones desactivadas' : 'Animaciones activadas'}
            >
              {reducedMotionEnabled ? 'Animación: Off' : 'Animación: On'}
            </button>
            <button
              onClick={handleMinimize}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              title="Minimizar"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesScrollRef} role="status" aria-live="polite">
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ChatMessage 
                message={message} 
                isAssistantSpeaking={message.role === 'assistant' && Boolean(message.isLoading || isLoading)}
                assistantMood={assistantMood as any}
                reducedMotion={prefersReducedMotion}
              />
            </React.Fragment>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-gray-100 rounded-2xl max-w-[85%] flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-white relative z-50" style={{ pointerEvents: 'auto' }}>
          <div style={{ position: 'relative', zIndex: 50 }}>
            <ChatInput 
              onSendMessage={handleSendMessage}
              isDisabled={isLoading}
              placeholder="Escribe tu mensaje..."
            />
            {/* Mostrar sugerencias iniciales */}
            {showInitialSuggestions && (
              <div className="p-4">
                <ChatSuggestions 
                  onSelect={handleSendMessage}
                  suggestions={initialSuggestions}
                />
              </div>
            )}
            
            {/* Mostrar opciones del último mensaje del asistente */}
            {hasMessageOptions && (
              <div className="p-4 border-t border-gray-100">
                <ChatSuggestions 
                  onSelect={handleSendMessage}
                  suggestions={getMessageOptions()}
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center mt-2" style={{ position: 'relative', zIndex: 50 }}>
            Eva es una IA. Puede cometer errores. Revisa la información importante.
          </p>
        </div>
      </motion.div>

      {/* Floating Button (when chat is closed) */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        >
          <motion.button
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
            style={chatButtonStyle}
            onClick={handleToggleChat}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            animate="pulse"
          >
            <EvaAvatar size={28} isSpeaking={false} mood={assistantMood as any} reducedMotion={prefersReducedMotion} />
          </motion.button>
        </motion.div>
      )}
    </>
  );
};

export default Chatbot;
