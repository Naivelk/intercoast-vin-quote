// Simple event bus for opening the chatbot from anywhere in the app
export type ChatbotOpenEventDetail = {
  message?: string;
};

export type HandoffEventDetail = {
  reason?: string;
  currentStep?: string;
  userData?: any;
  conversationId?: string;
};

const EVENT_NAME = 'chatbot:open';
const HANDOFF_EVENT_NAME = 'chatbot:handoff';
const MOOD_EVENT_NAME = 'chatbot:mood';

export type MoodEventDetail = {
  mood: 'neutral' | 'thinking' | 'happy' | 'concerned';
};

export function openChatbot(message?: string) {
  const event = new CustomEvent<ChatbotOpenEventDetail>(EVENT_NAME, {
    detail: { message },
  });
  window.dispatchEvent(event);
}

export function onOpenChatbot(handler: (detail: ChatbotOpenEventDetail) => void) {
  function listener(ev: Event) {
    const custom = ev as CustomEvent<ChatbotOpenEventDetail>;
    handler(custom.detail || {});
  }
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

export function requestHandoff(detail: HandoffEventDetail = {}) {
  const event = new CustomEvent<HandoffEventDetail>(HANDOFF_EVENT_NAME, {
    detail,
  });
  window.dispatchEvent(event);
}

export function onHandoff(handler: (detail: HandoffEventDetail) => void) {
  function listener(ev: Event) {
    const custom = ev as CustomEvent<HandoffEventDetail>;
    handler(custom.detail || {});
  }
  window.addEventListener(HANDOFF_EVENT_NAME, listener);
  return () => window.removeEventListener(HANDOFF_EVENT_NAME, listener);
}

export function setAssistantMood(mood: MoodEventDetail['mood']) {
  const event = new CustomEvent<MoodEventDetail>(MOOD_EVENT_NAME, {
    detail: { mood },
  });
  window.dispatchEvent(event);
}

export function onAssistantMood(handler: (detail: MoodEventDetail) => void) {
  function listener(ev: Event) {
    const custom = ev as CustomEvent<MoodEventDetail>;
    handler(custom.detail || { mood: 'neutral' });
  }
  window.addEventListener(MOOD_EVENT_NAME, listener);
  return () => window.removeEventListener(MOOD_EVENT_NAME, listener);
}
