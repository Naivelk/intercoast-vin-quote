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
const QUICK_ACTION_EVENT_NAME = 'chatbot:quick-action';

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

export function startChatbotFlow(message: string) {
  // The phone dock is controlled separately from the chat timeline. Open it
  // first, then deliver the selected intent once the dialog is available.
  window.dispatchEvent(new CustomEvent('eva:dock:open'));
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent<ChatbotOpenEventDetail>(QUICK_ACTION_EVENT_NAME, { detail: { message } }));
  }, 180);
}

export function onChatbotQuickAction(handler: (detail: ChatbotOpenEventDetail) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<ChatbotOpenEventDetail>).detail || {});
  window.addEventListener(QUICK_ACTION_EVENT_NAME, listener);
  return () => window.removeEventListener(QUICK_ACTION_EVENT_NAME, listener);
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
