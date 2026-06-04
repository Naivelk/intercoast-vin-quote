import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ChatMessage,
  UserData, 
  ChatbotContextType, 
  InsuranceType, 
  Vehicle, 
  BotResponse,
  MessageOptions,
  MessageType,
  MessageRole
} from './chatbot.types';
import { config as chatbotConfig, isChatbotStep, steps } from './chatbot.config';
import { getAIResponseSafe } from './openai';
import { prepareFormData, calculateTotalEstimate, formatPrice, calculateVehicleEstimate } from './pricingEngine';
import { decodeVIN2Steps, isValidVIN } from './vin';
import { requestHandoff, setAssistantMood } from './eventBus';
import { resolveFaq as kbResolve } from './knowledge/faq';

const { messages: msgConfig } = chatbotConfig;

// Utility functions
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const smallTalk = {
  hola: [
    '¡Hola! 😊',
    '¡Hola! ¿Cómo te ayudo?',
    '¡Hola! Estoy aquí para ayudarte.',
  ] as const,
  gracias: [
    '¡Con gusto! 🙌',
    '¡Para eso estoy! 😊',
    '¡De nada! ¿Seguimos?',
  ] as const,
  ok: [
    'Perfecto. 👍',
    'Listo, seguimos. 👌',
    'Entendido. ✅',
  ] as const,
  si: [
    '¡Genial! 😊',
    'Perfecto, avancemos. 🚀',
    'Excelente, continúo. ✅',
  ] as const,
  no: [
    'De acuerdo. 🤝',
    'Ok, dime cómo prefieres seguir. 🙂',
    'Está bien, te escucho. 👂',
  ] as const,
} as const;

// Session TTL (soft): 90 minutes
const SESSION_TTL_MS = 90 * 60 * 1000;
const detectInsuranceType = (input: string): InsuranceType => {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('auto') || lowerInput.includes('carro') || lowerInput.includes('vehículo') || lowerInput.includes('vehiculo')) {
    return 'auto';
  } else if (lowerInput.includes('hogar') || lowerInput.includes('casa')) {
    return 'home';
  } else if (lowerInput.includes('moto') || lowerInput.includes('motocicleta')) {
    return 'motorcycle';
  } else if (lowerInput.includes('barco') || lowerInput.includes('lancha') || lowerInput.includes('embarcación')) {
    return 'boat';
  }
  return 'other';
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // Accepts formats like: 123-456-7890, (123) 456-7890, 123 456 7890, 1234567890
  const phoneRegex = /^(\+\d{1,3}\s?)?(?:\(\d{1,4}\)|\d{1,4})[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return phoneRegex.test(phone);
};

const isValidDate = (date: string): boolean => {
  // Formato esperado: MM/DD/YYYY (Estados Unidos)
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(date)) return false;
  const [month, day, year] = date.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

const getNextVehicleQuestion = (vehicleIndex: number, vehicles: Vehicle[]): string => {
  const vehicle = vehicles[vehicleIndex] || {};
  // Preguntar únicamente por el VIN (el resto de datos se decodifican automáticamente)
  if (!vehicle.vin) {
    return msgConfig.askVehicleVin(vehicleIndex);
  }
  return '';
};

// Función para enviar datos a Google Sheets (alineada al formulario web)
const sendQuoteToGoogleSheets = async (userData: UserData, idempotencyKey?: string) => {
  try {
    const fd = new FormData();
    fd.append('nombre', userData.name || '');
    fd.append('nacimiento', userData.birthDate || '');
    fd.append('documento', userData.documentNumber || '');
    fd.append('direccion', userData.address || '');
    fd.append('email', userData.email || '');
    fd.append('telefono', userData.phone || '');
    if (idempotencyKey) fd.append('idempotencyKey', idempotencyKey);

    const vehicles = userData.vehicles || [];
    const cantidadVehiculos = Math.min(Math.max(vehicles.length || 1, 1), 5);
    fd.append('cantidadVehiculos', String(cantidadVehiculos));

    // Total estimado (si ya se calculó), o calcularlo
    const total = userData.quoteAmount != null
      ? userData.quoteAmount
      : calculateTotalEstimate(vehicles as any[], userData.birthDate || '');
    fd.append('totalEstimado', String(total));

    // Adjuntar cada vehículo como vehiculo{idx}
    vehicles.forEach((v, idx) => {
      const estimated = calculateVehicleEstimate(v as any, userData.birthDate || '');
      fd.append(`vehiculo${idx}`,
        JSON.stringify({
          vin: v.vin || '',
          year: v.year || '',
          make: v.make || '',
          model: v.model || '',
          bodyClass: v.bodyClass || '',
          estimated: estimated || 0,
        })
      );
    });

    fd.append('timestamp', new Date().toISOString());

    await fetch("https://script.google.com/macros/s/AKfycbwc9Wg3fubgmvIMlXPPoJVcgiQ96cQwVU_vIIM1Qr1oIPpO0OkrG-DBCRaVcGjgXiGA/exec", {
      method: 'POST',
      mode: 'no-cors',
      body: fd,
    });
    console.log('Evento: sent_to_sheets', { conversationId: 'n/a', timestamp: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error('Error sending quote to Google Sheets:', error);
    return false;
  }
};

function vehicleLine(v: Vehicle, i: number): string {
  const parts: string[] = [];
  if (v.year || v.make || v.model) parts.push(`${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim());
  if (v.bodyClass) parts.push(`${v.bodyClass}`);
  const extra: string[] = [];
  if (v.fuelType) extra.push(`${v.fuelType}`);
  if (v.engineHP) extra.push(`${v.engineHP} HP`);
  if (v.doors) extra.push(`${v.doors} puertas`);
  const extraStr = extra.length ? ` (${extra.join(' · ')})` : '';
  const title = parts.join(' — ');
  return `• Vehículo ${i + 1}: ${title}${extraStr}`;
}

// Función para mostrar la cotización
const showQuote = async (
  userData: UserData,
  addBotMessage: (content: string, options?: any) => void,
  trackEventCb?: (name: string, data?: Record<string, any>) => void
) => {
  if (!userData.vehicles?.length || !userData.birthDate) return;
  
  const total = calculateTotalEstimate(userData.vehicles, userData.birthDate);
  const formattedPrice = formatPrice(total);
  const list = (userData.vehicles || []).map((v, i) => vehicleLine(v, i)).join('\n');
  trackEventCb?.('quote_shown', { total, vehicles: userData.vehicles?.length || 0 });
  // T2P metric
  try {
    const started = (window as any).__EVA_FIRST_USER_TS__ as number | undefined;
    if (started) {
      const dur = Date.now() - started;
      const key = 'EVA_T2P_SAMPLES';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(dur);
      while (arr.length > 200) arr.shift();
      localStorage.setItem(key, JSON.stringify(arr));
      const sorted = [...arr].sort((a: number, b: number) => a - b);
      const p = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor((q / 100) * sorted.length))];
      console.log('T2P ms:', dur, 'p90:', p(90), 'p95:', p(95));
    }
  } catch {}
  setAssistantMood('happy');
  
  await addBotMessage(`¡Gracias por la información! Aquí tienes tu resumen:

${list}

💰 Precio estimado mensual: ${formattedPrice}

ℹ️ Estimación no vinculante; sujeta a aseguradora, estado y verificación. Tratamos tus datos según nuestra política de privacidad.

¿Te gustaría proceder con esta cotización?`, {
    type: 'suggestion',
    options: ['Sí, continuar', 'No, volver a cotizar', 'Hablar con un asesor 👨‍💼']
  });
  
  return total;
};

// Función para procesar la información del vehículo
const processVehicleInfo = async (
  input: string,
  userData: UserData,
  addBotMessage: (content: string, options?: any) => void,
  trackEvent?: (name: string, data?: Record<string, any>) => void
) => {
  const currentVehicleIndex = userData.currentVehicleIndex || 0;
  const vehicles = [...(userData.vehicles || [])];
  let currentVehicle = vehicles[currentVehicleIndex] || {};

  // Si el usuario ingresó un VIN válido en cualquier momento, decodificar y poblar datos
  const trimmed = (input || '').trim();
  const lowerIn = trimmed.toLowerCase();

  // Helper: No tengo el VIN
  if (lowerIn.includes('no tengo el vin') || lowerIn === 'no sé' || lowerIn === 'no se') {
    await addBotMessage(
      'Sin el VIN puedo darte tips para encontrarlo:\n\n' +
      '• En el tablero, lado del conductor (visible desde el parabrisas).\n' +
      '• En el marco de la puerta del conductor.\n' +
      '• En la tarjeta o registro del vehículo.\n\n' +
      'Cuando lo tengas, ingrésalo aquí. Si prefieres, puedo conectarte con un asesor.',
      { type: 'suggestion', options: ['Reingresar VIN', 'Hablar con un asesor 👨‍💼', 'Volver al inicio ⬅️'] }
    );
    trackEvent?.('vin_help_shown', { index: currentVehicleIndex });
    return { ...userData, vehicles, currentVehicleIndex, currentStep: steps.COLLECT_VEHICLE_INFO };
  }

  if (!currentVehicle.vin && isValidVIN(trimmed)) {
    try {
      trackEvent?.('vin_submitted', { index: currentVehicleIndex });
      await addBotMessage(pick(['¡Súper, gracias por el VIN! Dame 2 seg…', 'Perfecto, estoy revisándolo…', 'Recibido, analizando el VIN…']), { type: 'text' });
      setAssistantMood('thinking');
      const v = await decodeVIN2Steps(trimmed);
      currentVehicle = {
        ...currentVehicle,
        vin: trimmed,
        year: v.year || currentVehicle.year,
        make: v.make || currentVehicle.make,
        model: v.model || currentVehicle.model,
        bodyClass: v.bodyClass || currentVehicle.bodyClass,
        fuelType: v.fuelType || currentVehicle.fuelType,
        engineHP: v.engineHP || currentVehicle.engineHP,
        driveType: v.driveType || currentVehicle.driveType,
        vehicleType: v.vehicleType,
        engineCylinders: v.engineCylinders,
        displacementL: v.displacementL,
        transmissionStyle: v.transmissionStyle,
        transmissionSpeeds: v.transmissionSpeeds,
        doors: v.doors,
        seats: v.seats,
        gvwr: v.gvwr,
        series: v.series,
        trim: v.trim,
        plantCountry: v.plantCountry,
        plantCity: v.plantCity,
      } as any;
      // Mostrar resumen del vehículo decodificado de inmediato
      const summary = vehicleLine(currentVehicle, currentVehicleIndex);
      await addBotMessage(`Perfecto, he identificado tu vehículo:
${summary}`, { type: 'text' });
      trackEvent?.('nhtsa_decode_ok', { index: currentVehicleIndex });
      trackEvent?.('vehicle_decoded', { index: currentVehicleIndex, year: currentVehicle.year, make: currentVehicle.make, model: currentVehicle.model });
      // Confirmación rápida
      await addBotMessage('¿Esto coincide?', { type: 'suggestion', options: ['Sí, es correcto', 'Corregir'] });
      setAssistantMood('neutral');
    } catch (e) {
      await addBotMessage('No pude decodificar el VIN. Continuemos con la información manual.', { type: 'text' });
      trackEvent?.('nhtsa_decode_fail', { index: currentVehicleIndex });
      setAssistantMood('concerned');
    }
  } else {
  // Si no se ingresó un VIN válido, pedir nuevamente el VIN (evitar preguntas adicionales)
  if (!currentVehicle.vin) {
    if (trimmed.toLowerCase() === 'no sé' || trimmed.toLowerCase() === 'no se') {
      await addBotMessage('Para continuar con la cotización automática necesito el VIN (17 caracteres). Si no lo tienes a mano, puedo conectarte con un asesor.', { type: 'text' });
    } else if (trimmed && trimmed.length > 0) {
      // Usuario ingresó algo que no es VIN válido
      await addBotMessage('El VIN debe tener 17 caracteres y no contener I, O o Q. Intenta nuevamente.', { type: 'suggestion', options: ['No tengo el VIN', 'Volver al inicio ⬅️'] });
    }
  }
  }

  // Actualizar el vehículo en el array
  vehicles[currentVehicleIndex] = currentVehicle;
  
  // Si aún falta el VIN del vehículo actual, pedirlo de nuevo
  const nextQuestion = getNextVehicleQuestion(currentVehicleIndex, vehicles);
  if (nextQuestion) {
    await addBotMessage(nextQuestion, { type: 'suggestion', options: ['No tengo el VIN', 'Volver al inicio ⬅️'] });
    return { ...userData, vehicles, currentVehicleIndex, currentStep: steps.COLLECT_VEHICLE_INFO };
  }

  // VIN capturado y datos decodificados para el vehículo actual
  const totalVehicles = vehicles.length || 1;
  const nextIndex = currentVehicleIndex + 1;
  if (nextIndex < totalVehicles) {
    // Pasar al siguiente vehículo y pedir su VIN
    await addBotMessage(msgConfig.askVehicleVin(nextIndex), { type: 'suggestion', options: ['No tengo el VIN', 'Volver al inicio ⬅️'] });
    return { ...userData, vehicles, currentVehicleIndex: nextIndex, currentStep: steps.COLLECT_VEHICLE_INFO };
  }

  // Si no hay más vehículos, mostrar la cotización directamente
  await showQuote({ ...userData, vehicles }, addBotMessage, trackEvent);
  return { ...userData, vehicles, currentStep: steps.CONFIRM_QUOTE } as UserData;
};

export const useChatbot = (initialMessage?: string): ChatbotContextType & { isOpen: boolean; toggleChat: () => void } => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    currentStep: steps.WELCOME,
    vehicles: [{}],
    currentVehicleIndex: 0,
  });
  const conversationIdRef = useRef(uuidv4());
  const submittingRef = useRef(false);
  const hasShownWelcome = useRef(false);

  // Función para agregar un mensaje del usuario
  const addUserMessage = useCallback((content: string, options: MessageOptions = { type: 'text' }) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user' as MessageRole,
      content,
      timestamp: new Date(),
      metadata: { 
        type: options?.type || 'text', 
        ...(options?.options ? { options: options.options } : {}) 
      },
    };
    setMessages((prev) => [...prev, newMessage]);
    try { window.dispatchEvent(new CustomEvent('eva:sound:sent')); } catch {}
    try { if (!(window as any).__EVA_FIRST_USER_TS__) (window as any).__EVA_FIRST_USER_TS__ = Date.now(); } catch {}
    return newMessage;
  }, []);

  // Función para agregar un mensaje del bot
  const addBotMessage = useCallback(async (content: string | BotResponse, options?: MessageOptions) => {
    let messageContent: string;
    let messageOptions: MessageOptions = { type: 'text' };
    
    // Handle both string and BotResponse types
    if (typeof content === 'string') {
      messageContent = content;
      messageOptions = options ? { ...options } : { type: 'text' };
    } else {
      // It's a BotResponse object
      messageContent = content.content;
      messageOptions = {
        type: content.type || 'text',
        ...(content.options ? { options: [...content.options] } : {})
      };
    }

    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant' as MessageRole,
      content: messageContent,
      timestamp: new Date(),
      metadata: messageOptions ? { 
        type: messageOptions.type || 'text',
        ...(messageOptions.options ? { options: messageOptions.options } : {})
      } : undefined,
    };
    setMessages(prev => [...prev, newMessage]);
    try { window.dispatchEvent(new CustomEvent('eva:sound:received')); } catch {}
    return newMessage;
  }, []);

  // Función para mostrar el mensaje de bienvenida
  const showWelcomeMessage = useCallback(async (): Promise<void> => {
    if (messages.length === 0) {
      if (initialMessage) {
        // Pasar el mensaje como string y opciones por separado
        await addBotMessage(initialMessage, { type: 'text' });
      } else {
        // Usar type assertion para el objeto de respuesta
        const botResponse: BotResponse = {
          content: chatbotConfig.welcomeMessage,
          type: 'suggestion',
          options: [...chatbotConfig.initialSuggestions]
        };
        await addBotMessage(botResponse);
        // Ofrecer reanudar si hay sesión guardada
        try {
          const raw = sessionStorage.getItem('CHATBOT_USERDATA_V1');
          if (raw) {
            const parsed = JSON.parse(raw);
            const ts = parsed?.savedAt as number;
            if (ts && Date.now() - ts < SESSION_TTL_MS) {
              await addBotMessage('Veo una cotización pendiente. ¿Quieres retomar donde te quedaste?', {
                type: 'suggestion',
                options: ['Sí, retomar', 'No, empezar de nuevo']
              });
            } else {
              sessionStorage.removeItem('CHATBOT_USERDATA_V1');
            }
          }
        } catch {}
      }
    }
  }, [messages, initialMessage, addBotMessage, chatbotConfig.welcomeMessage, chatbotConfig.initialSuggestions]);
  

  // Función para procesar la entrada del usuario según el paso actual
  const processUserInput = useCallback(async (input: string, options: { skipUserMessage?: boolean } = { skipUserMessage: false }): Promise<void> => {
    // Inicializar variables
    let response: string | BotResponse = '';
    let newUserData: UserData = { ...userData };
    const lower = (input || '').trim().toLowerCase();
    const currentStep = newUserData.currentStep || 'welcome';

    // Persistir siempre el estado por si el usuario se va
    try { sessionStorage.setItem('CHATBOT_USERDATA_V1', JSON.stringify({ savedAt: Date.now(), data: newUserData })); } catch {}

    // Interceptores globales
    if (['humano','agente','asesor','llamar'].some(k => lower.includes(k))) {
      requestHandoff({ reason: input, currentStep, userData: newUserData, conversationId: conversationIdRef.current });
      await addBotMessage('Listo, te conecto con un asesor. Te escribirán en breve. ¿Deseas hacer algo más mientras tanto?', {
        type: 'suggestion', options: ['Volver al inicio ⬅️', 'Continuar cotización ▶️']
      });
      setUserData(newUserData);
      return;
    }

    if (['volver', 'inicio', 'empezar de nuevo', 'regresar'].some(k => lower.includes(k))) {
      // Guardar progreso para retomar luego
      try { sessionStorage.setItem('CHATBOT_ABORT_SNAPSHOT', JSON.stringify(newUserData)); } catch {}
      // Métrica de abandono
      console.log('Evento: abandoned_step', { currentStep, timestamp: new Date().toISOString() });
      await addBotMessage({
        content: chatbotConfig.welcomeMessage,
        type: 'suggestion',
        options: [...chatbotConfig.initialSuggestions]
      });
      setUserData({ currentStep: steps.WELCOME, vehicles: [{}], currentVehicleIndex: 0 });
      return;
    }

    if (['ayuda','no entiendo','como hago','cómo hago','help'].some(k => lower.includes(k))) {
      const tip = currentStep === steps.COLLECT_VEHICLE_INFO
        ? 'Para encontrar el VIN: en el tablero (lado conductor), marco de la puerta del conductor, o en el registro del vehículo.'
        : 'Puedo guiarte paso a paso. Si quieres, también puedo conectarte con un asesor.';
      await addBotMessage(`${tip}`, { type: 'suggestion', options: ['Continuar cotización ▶️', 'Hablar con un asesor 👨‍💼', 'Volver al inicio ⬅️'] });
      setUserData(newUserData);
      return;
    }

    if (['estado de mi cotización','estado de mi cotizacion','no recibí correo','no recibi correo','no me contactaron'].some(k => lower.includes(k))) {
      await addBotMessage('Gracias por avisar. Usualmente te contactamos en 24–48h hábiles tras enviar la solicitud. Si lo prefieres, puedo escalar tu caso a un asesor ahora mismo.', {
        type: 'suggestion', options: ['Hablar con un asesor 👨‍💼', 'Volver al inicio ⬅️']
      });
      setUserData(newUserData);
      return;
    }

    // Small talk (no cambia de paso). Evitar interferir con confirm_quote para sí/no
    if (['hola','buenas','buenas tardes','buenos días','buenos dias'].some(k => lower.startsWith(k))) {
      await addBotMessage(pick(smallTalk.hola), { type: 'text' });
      setUserData(newUserData);
      return;
    }
    if (['gracias','muchas gracias','mil gracias'].some(k => lower === k)) {
      await addBotMessage(pick(smallTalk.gracias), { type: 'text' });
      setUserData(newUserData);
      return;
    }
    if (['ok','vale','entendido','perfecto','listo'].some(k => lower === k)) {
      await addBotMessage(pick(smallTalk.ok), { type: 'text' });
      setUserData(newUserData);
      return;
    }
    if (currentStep !== steps.CONFIRM_QUOTE && (lower === 'si' || lower === 'sí')) {
      await addBotMessage(pick(smallTalk.si), { type: 'text' });
      setUserData(newUserData);
      return;
    }
    if (currentStep !== steps.CONFIRM_QUOTE && lower === 'no') {
      await addBotMessage(pick(smallTalk.no), { type: 'text' });
      setUserData(newUserData);
      return;
    }

    // FAQ intercept (no cambia de paso)
    const kb = kbResolve(lower);
    if (kb) {
      const vinFlow = currentStep === steps.COLLECT_VEHICLE_INFO;
      const options = kb.options && kb.options.length ? kb.options : (vinFlow ? ['Continuar cotización ▶️', 'Ver otra póliza 📋', 'Volver al inicio ⬅️'] : ['Cotizar seguro de auto 🚗', 'Ver otra póliza 📋', 'Volver al inicio ⬅️']);
      const prefix = (kb.id === 'about' || kb.id === 'help-index') ? '¡Claro! ' : 'Claro, ';
      await addBotMessage(`${prefix}${kb.answer}`, { type: 'suggestion', options });
      setUserData(newUserData);
      return;
    }
    
    // Check if this is a predefined option (like initial suggestions)
    const isPredefinedOption = (chatbotConfig.initialSuggestions as readonly string[]).includes(input)
      || (chatbotConfig.policyOptions as readonly string[] | undefined)?.includes?.(input as any)
      || [
        'Sí, retomar', 'No, empezar de nuevo', 'No tengo el VIN', 'Reingresar VIN', 'Continuar cotización ▶️', 'Hablar con un asesor 👨‍💼', 'Sí, es correcto', 'Corregir', 'Llamar 📞', 'WhatsApp 💬',
        '¿Qué puedo preguntar? ❓', 'Oficinas y contacto 📍', 'Ver versión extendida 📄', 'Descuentos 💸', 'Renovaciones/SR-22 📄'
      ].includes(input);
    
    // Get current step or default to 'welcome' (already computed above)
    
    // Initialize response with a default value
    response = '';
    
    // Handle predefined options without calling OpenAI
    if (isPredefinedOption) {
      if (input === 'Sí, retomar') {
        try {
          const raw = sessionStorage.getItem('CHATBOT_USERDATA_V1');
          if (raw) {
            const parsed = JSON.parse(raw);
            const ts = parsed?.savedAt as number;
            if (ts && Date.now() - ts < SESSION_TTL_MS) {
              setUserData(parsed.data);
            }
            await addBotMessage('Perfecto, retomamos donde lo dejaste. 😊', { type: 'text' });
            return;
          }
        } catch {}
        // Si no hay guardado, comenzar normal
        await addBotMessage({ content: chatbotConfig.welcomeMessage, type: 'suggestion', options: [...chatbotConfig.initialSuggestions] });
        setUserData({ currentStep: steps.WELCOME, vehicles: [{}], currentVehicleIndex: 0 });
        return;
      }

      if (input === 'No, empezar de nuevo') {
        await addBotMessage({ content: chatbotConfig.welcomeMessage, type: 'suggestion', options: [...chatbotConfig.initialSuggestions] });
        setUserData({ currentStep: steps.WELCOME, vehicles: [{}], currentVehicleIndex: 0 });
        return;
      }

      if (input === 'Hablar con un asesor 👨‍💼') {
        requestHandoff({ reason: 'user_button', currentStep, userData: newUserData, conversationId: conversationIdRef.current });
        await addBotMessage('Un asesor te contactará en breve. ¿Deseas hacer algo más mientras tanto?', { type: 'suggestion', options: ['Volver al inicio ⬅️'] });
        setUserData(newUserData);
        return;
      }

      if (input === 'No tengo el VIN') {
        await addBotMessage('Puedo ayudarte a encontrarlo. Ubicaciones: tablero (lado conductor), marco de la puerta del conductor, registro del vehículo. Cuando lo tengas, escríbelo aquí.', { type: 'suggestion', options: ['Reingresar VIN', 'Hablar con un asesor 👨‍💼', 'Volver al inicio ⬅️'] });
        setUserData(newUserData);
        return;
      }

      if (input === 'Reingresar VIN' || input === 'Corregir') {
        // Borrar VIN actual y volver a pedirlo
        const idx = newUserData.currentVehicleIndex || 0;
        const arr = [...(newUserData.vehicles || [])];
        arr[idx] = { ...(arr[idx] || {}), vin: undefined } as Vehicle;
        newUserData.vehicles = arr;
        await addBotMessage(msgConfig.askVehicleVin(idx), { type: 'suggestion', options: ['No tengo el VIN', 'Volver al inicio ⬅️'] });
        setUserData(newUserData);
        return;
      }

      if (input === 'Sí, es correcto') {
        await addBotMessage(pick(smallTalk.ok), { type: 'text' });
        setUserData(newUserData);
        return;
      }

      if (input === 'Continuar cotización ▶️') {
        const idx = newUserData.currentVehicleIndex || 0;
        await addBotMessage(msgConfig.askVehicleVin(idx), { type: 'suggestion', options: ['No tengo el VIN', 'Volver al inicio ⬅️'] });
        newUserData.currentStep = steps.COLLECT_VEHICLE_INFO;
        setUserData(newUserData);
        return;
      }
      if (input === 'Llamar 📞') {
        await addBotMessage('Puedes llamarnos a:\n• +1 (562) 381-2012\n• +1 (424) 417-1700\n\nTambién puedes volver al inicio para más opciones.', { type: 'suggestion', options: ['Volver al inicio ⬅️'] });
        setUserData(newUserData);
        return;
      }
      if (input === 'WhatsApp 💬') {
        await addBotMessage('Escríbenos a WhatsApp: +1 (775) 675-4559\nEnlace: https://wa.me/17756754559', { type: 'suggestion', options: ['Volver al inicio ⬅️'] });
        setUserData(newUserData);
        return;
      }
      if (input === '¿Qué puedo preguntar? ❓') {
        const kbAns = kbResolve('qué puedo preguntar');
        const opts = kbAns?.options?.length ? kbAns.options : ['Cotizar seguro de auto 🚗', 'Ver tipos de pólizas 📋', 'Volver al inicio ⬅️'];
        await addBotMessage(`${kbAns ? '¡Claro! ' + kbAns.answer : 'Puedo orientarte por temas: cotización, descuentos, renovaciones/SR-22, siniestros y contacto.'}`, { type: 'suggestion', options: opts });
        setUserData(newUserData);
        return;
      }
      if (input === 'Oficinas y contacto 📍') {
        const kbAns = kbResolve('oficinas');
        const opts = kbAns?.options?.length ? kbAns.options : ['Llamar 📞', 'WhatsApp 💬', 'Volver al inicio ⬅️'];
        await addBotMessage(`${kbAns ? '¡Claro! ' + kbAns.answer : 'Estamos en South Gate y Compton. Tel: +1 (562) 381-2012 · +1 (424) 417-1700. WhatsApp: +1 (775) 675-4559.'}`, { type: 'suggestion', options: opts });
        setUserData(newUserData);
        return;
      }
      if (input === 'Ver versión extendida 📄') {
        const kbAns = kbResolve('versión extendida');
        const opts = kbAns?.options?.length ? kbAns.options : ['Llamar 📞', 'WhatsApp 💬', 'Volver al inicio ⬅️'];
        await addBotMessage(`${kbAns ? kbAns.answer : 'Aquí tienes la versión extendida de quiénes somos y cómo trabajamos.'}`, { type: 'suggestion', options: opts });
        setUserData(newUserData);
        return;
      }
      if (input === 'Descuentos 💸') {
        const kbAns = kbResolve('descuentos');
        const opts = kbAns?.options?.length ? kbAns.options : ['Cotizar seguro de auto 🚗', 'Ver tipos de pólizas 📋', 'Volver al inicio ⬅️'];
        await addBotMessage(`${kbAns ? '¡Buen punto! ' + kbAns.answer : 'Podemos buscar descuentos como multi-auto, buen historial y pago automático.'}`, { type: 'suggestion', options: opts });
        setUserData(newUserData);
        return;
      }
      if (input === 'Renovaciones/SR-22 📄') {
        const kbAns = kbResolve('renovaciones') || kbResolve('sr-22');
        const opts = kbAns?.options?.length ? kbAns.options : ['Cotizar renovación 🔄', 'SR-22 📄', 'Volver al inicio ⬅️'];
        await addBotMessage(`${kbAns ? 'Te cuento: ' + kbAns.answer : 'Te ayudamos a renovar y, si aplica, gestionar SR-22.'}`, { type: 'suggestion', options: opts });
        setUserData(newUserData);
        return;
      }
      if (input.includes('Volver al inicio')) {
        await addBotMessage({
          content: chatbotConfig.welcomeMessage,
          type: 'suggestion',
          options: [...chatbotConfig.initialSuggestions]
        });
        newUserData.currentStep = steps.WELCOME;
        setUserData(newUserData);
        return;
      }

      if (input.includes('Ver otra póliza')) {
        await addBotMessage({
          content: chatbotConfig.messages.policyMenuPrompt,
          type: 'suggestion',
          options: [...(chatbotConfig.policyOptions || [])]
        });
        trackEvent('policy_menu_opened');
        newUserData.currentStep = steps.POLICY_MENU;
        setUserData(newUserData);
        return;
      }

      if (input.includes('Seguro de Auto') || input.includes('Seguro de Hogar')) {
        // Mostrar detalle de la póliza seleccionada
        let detail = '';
        if (input.includes('Auto')) detail = chatbotConfig.messages.autoPolicyInfo;
        else if (input.includes('Hogar')) detail = chatbotConfig.messages.homePolicyInfo;

        await addBotMessage({
          content: detail,
          type: 'suggestion',
          options: [
            chatbotConfig.messages.quoteThisPolicy,
            chatbotConfig.messages.seeOtherPolicies,
            chatbotConfig.messages.backToMenu,
          ]
        });
        newUserData.currentStep = steps.POLICY_DETAIL;
        setUserData(newUserData);
        return;
      }

      if (input.includes('Ver tipos de pólizas')) {
        await addBotMessage({
          content: chatbotConfig.messages.policyMenuPrompt,
          type: 'suggestion',
          options: [...(chatbotConfig.policyOptions || [])]
        });
        trackEvent('policy_menu_opened');
        newUserData.currentStep = steps.POLICY_MENU;
        setUserData(newUserData);
        return;
      }

      if (input.includes('Cotizar')) {
        // Ir directamente a la cotización de auto
        newUserData.insuranceType = 'auto';
        response = msgConfig.askVehicleCount;
        newUserData.currentStep = 'ask_vehicle_count';
      } else if (input.includes('documentos')) {
        await addBotMessage({
          content: 'Para cotizar tu seguro, necesitarás los siguientes documentos:\n\n' +
                  '📝 Identificación oficial (INE o pasaporte)\n' +
                  '🚗 Para seguros de auto: licencia de conducir y tarjeta de circulación\n' +
                  '🏠 Para seguros de hogar: comprobante de domicilio y escrituras (si aplica)\n\n' +
                  '¿Deseas continuar?',
          type: 'suggestion',
          options: ['Cotizar seguro de auto 🚗', 'Volver al inicio ⬅️']
        });
        newUserData.currentStep = steps.WELCOME;
        setUserData(newUserData);
        return;
      }
    }
    
      // Si no es una opción predefinida, procesar según el paso actual
    if (!isPredefinedOption) {
      switch (currentStep) {
        case steps.WELCOME: {
          const lower = input.toLowerCase();
          if (lower.includes('cotiz') || lower.includes('precio') || lower.includes('auto')) {
            newUserData.insuranceType = 'auto';
            response = msgConfig.askVehicleCount;
            newUserData.currentStep = 'ask_vehicle_count';
          } else if (lower.includes('póliz') || lower.includes('poliz') || lower.includes('tipos') || (lower.includes('ver') && lower.includes('pol'))) {
            await addBotMessage({ content: chatbotConfig.messages.policyMenuPrompt, type: 'suggestion', options: [...(chatbotConfig.policyOptions || [])] });
            trackEvent('policy_menu_opened');
            newUserData.currentStep = steps.POLICY_MENU;
            response = '';
          } else if (lower.includes('document') || lower.includes('requisit')) {
            await addBotMessage({
              content: 'Para cotizar tu seguro, necesitarás los siguientes documentos:\n\n' +
                      '📝 Identificación oficial (INE o pasaporte)\n' +
                      '🚗 Para seguros de auto: licencia de conducir y tarjeta de circulación\n' +
                      '🏠 Para seguros de hogar: comprobante de domicilio y escrituras (si aplica)\n\n' +
                      '¿Deseas continuar?',
              type: 'suggestion',
              options: ['Cotizar seguro de auto 🚗', 'Volver al inicio ⬅️']
            });
            newUserData.currentStep = steps.WELCOME;
            response = '';
          } else {
            response = {
              content: chatbotConfig.welcomeMessage,
              type: 'suggestion' as const,
              options: [...chatbotConfig.initialSuggestions]
            } as const;
            newUserData.currentStep = steps.WELCOME;
          }
          break;
        }

      case steps.POLICY_MENU: {
        const lower = input.toLowerCase();
        if (lower.includes('auto')) {
          await addBotMessage({ content: chatbotConfig.messages.autoPolicyInfo, type: 'suggestion', options: [chatbotConfig.messages.quoteThisPolicy, chatbotConfig.messages.seeOtherPolicies, chatbotConfig.messages.backToMenu] });
          newUserData.currentStep = steps.POLICY_DETAIL;
          response = '';
        } else if (lower.includes('hogar')) {
          await addBotMessage({ content: chatbotConfig.messages.homePolicyInfo, type: 'suggestion', options: [chatbotConfig.messages.quoteThisPolicy, chatbotConfig.messages.seeOtherPolicies, chatbotConfig.messages.backToMenu] });
          newUserData.currentStep = steps.POLICY_DETAIL;
          response = '';
        } else if (lower.includes('vida')) {
          await addBotMessage({ content: chatbotConfig.messages.lifePolicyInfo, type: 'suggestion', options: [chatbotConfig.messages.quoteThisPolicy, chatbotConfig.messages.seeOtherPolicies, chatbotConfig.messages.backToMenu] });
          newUserData.currentStep = steps.POLICY_DETAIL;
          response = '';
        } else if (lower.includes('salud')) {
          await addBotMessage({ content: chatbotConfig.messages.healthPolicyInfo, type: 'suggestion', options: [chatbotConfig.messages.quoteThisPolicy, chatbotConfig.messages.seeOtherPolicies, chatbotConfig.messages.backToMenu] });
          newUserData.currentStep = steps.POLICY_DETAIL;
          response = '';
        } else if (lower.includes('volver')) {
          response = {
            content: chatbotConfig.welcomeMessage,
            type: 'suggestion' as const,
            options: [...chatbotConfig.initialSuggestions]
          } as const;
          newUserData.currentStep = steps.WELCOME;
        } else if (lower === 'si' || lower === 'sí') {
          await addBotMessage({ content: chatbotConfig.messages.policyMenuPrompt, type: 'suggestion', options: [...(chatbotConfig.policyOptions || [])] });
          trackEvent('policy_menu_opened');
          newUserData.currentStep = steps.POLICY_MENU;
          response = '';
        } else {
          await addBotMessage({ content: chatbotConfig.messages.policyMoreInfoPrompt, type: 'suggestion', options: [...(chatbotConfig.policyOptions || [])] });
          trackEvent('policy_menu_opened');
          newUserData.currentStep = steps.POLICY_MENU;
          response = '';
        }
        break;
      }

      case steps.POLICY_DETAIL: {
        const lower = input.toLowerCase();
        if (lower.includes('ver otra')) {
          await addBotMessage({ content: chatbotConfig.messages.policyMenuPrompt, type: 'suggestion', options: [...(chatbotConfig.policyOptions || [])] });
          newUserData.currentStep = steps.POLICY_MENU;
          response = '';
        } else if (lower.includes('volver')) {
          response = {
            content: chatbotConfig.welcomeMessage,
            type: 'suggestion' as const,
            options: [...chatbotConfig.initialSuggestions]
          } as const;
          newUserData.currentStep = steps.WELCOME;
        } else if (lower.includes('cotizar')) {
          newUserData.insuranceType = 'auto';
          response = msgConfig.askVehicleCount;
          newUserData.currentStep = 'ask_vehicle_count';
        } else {
          await addBotMessage({ content: chatbotConfig.messages.policyMoreInfoPrompt, type: 'suggestion', options: [...(chatbotConfig.policyOptions || [])] });
          newUserData.currentStep = steps.POLICY_MENU;
          response = '';
        }
        break;
      }

      case steps.ASK_INSURANCE_TYPE: {
        const insuranceType = detectInsuranceType(input);
        newUserData.insuranceType = insuranceType;
        if (insuranceType === 'auto') {
          response = msgConfig.askVehicleCount;
          newUserData.currentStep = 'ask_vehicle_count';
        } else {
          response = 'Por ahora puedo ayudarte a cotizar seguros de auto. ¿Deseas cotizar un auto?';
          newUserData.currentStep = steps.ASK_INSURANCE_TYPE;
        }
        break;
      }

      case 'ask_name':
        newUserData.name = input;
        response = `¡Hola ${input}! ${chatbotConfig.messages.askEmail}`;
        newUserData.currentStep = 'ask_email';
        break;

      case 'ask_email':
        if (!isValidEmail(input)) {
          response = chatbotConfig.errorMessages.invalidEmail;
          break;
        }
        newUserData.email = input;
        response = chatbotConfig.messages.askPhone;
        newUserData.currentStep = 'ask_phone';
        break;

      case 'ask_phone':
        if (!isValidPhone(input)) {
          response = chatbotConfig.errorMessages.invalidPhone;
          break;
        }
        newUserData.phone = input;
        // Ya no pedimos fecha de nacimiento aquí; se pidió antes de los VIN
        response = chatbotConfig.messages.askAddress;
        newUserData.currentStep = 'ask_address';
        break;

      case 'ask_birthdate':
        if (!isValidDate(input)) {
          response = chatbotConfig.errorMessages.invalidBirthdate;
          setAssistantMood('concerned');
          break;
        }
        newUserData.birthDate = input;
        // Si estamos en flujo de cotización, comenzamos a pedir VIN del primer vehículo
        if ((newUserData.vehicles?.length || 0) > 0 && !newUserData.vehicles?.[0]?.vin) {
          newUserData.currentStep = 'collect_vehicle_info';
          newUserData.currentVehicleIndex = 0;
          await addBotMessage(msgConfig.askVehicleVin(0), { type: 'suggestion', options: ['No tengo el VIN', 'Volver al inicio ⬅️'] });
          response = '';
        } else {
          // Fallback: si no hay vehículos definidos, continuar flujo estándar
          response = chatbotConfig.messages.askAddress;
          newUserData.currentStep = 'ask_address';
        }
        break;

      case 'ask_address':
        newUserData.address = input;
        response = chatbotConfig.messages.askDocument;
        newUserData.currentStep = 'ask_document';
        break;

      case 'ask_document':
        newUserData.documentNumber = input;
        // Idempotencia: evitar envíos duplicados
        if (submittingRef.current) {
          response = 'Estamos procesando tu solicitud. Por favor, espera un momento.';
          newUserData.currentStep = 'finish';
          break;
        }
        submittingRef.current = true;
        try {
          // Enviar a Google Sheets con idempotencyKey
          await sendQuoteToGoogleSheets(newUserData, conversationIdRef.current);
          response = chatbotConfig.messages.finish;
          newUserData.currentStep = 'finish';
        } finally {
          submittingRef.current = false;
        }
        break;

      case 'ask_vehicle_count': {
        const count = parseInt(input, 10);
        if (isNaN(count) || count < 1 || count > 5) {
          response = chatbotConfig.errorMessages.invalidVehicleCount;
          break;
        }
        newUserData.vehicles = Array.from({ length: count }, () => ({} as Vehicle));
        // Pedir fecha de nacimiento antes de empezar con VIN para estimar precio
        newUserData.currentStep = 'ask_birthdate';
        response = chatbotConfig.messages.askBirthdate;
        break;
      }

      case 'collect_vehicle_info': {
        const updated = await processVehicleInfo(input, newUserData, addBotMessage, trackEvent);
        if (updated) {
          newUserData = updated as UserData;
          // processVehicleInfo ya envía el siguiente mensaje o la cotización
          response = '';
        }
        break;
      }

      // El paso ask_another_vehicle ya no se usa porque pedimos la cantidad desde el inicio

      case 'confirm_quote': {
        const lower = (input || '').toLowerCase();
        if (lower.includes('sí') || lower.includes('si')) {
          // Recopilar datos personales para enviar la cotización
          trackEvent('quote_confirmed');
          setAssistantMood('happy');
          response = chatbotConfig.messages.askName;
          newUserData.currentStep = 'ask_name';
        } else {
          response = 'De acuerdo. ¿Deseas hacer otra cotización o necesitas ayuda con algo más?';
          newUserData.currentStep = 'finish';
        }
        break;
      }

      default:
        try {
          const ai = await getAIResponseSafe(messages as any, newUserData);
          response = ai || "No estoy seguro de cómo responder a eso. ¿Podrías reformular tu pregunta?";
        } catch {
          response = "No estoy seguro de cómo responder a eso. ¿Podrías reformular tu pregunta?";
        }
    }

    // Cerrar el bloque if (!isPredefinedOption)
  }

    // Actualizar el estado con los nuevos datos del usuario
    setUserData(newUserData);

    // Agregar la respuesta del bot
    if (response) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (typeof response === 'string') {
        await addBotMessage(response, { type: 'text' });
      } else if (response && typeof response === 'object' && 'content' in response) {
        // Handle BotResponse object type
        await addBotMessage({
          content: response.content,
          type: response.type || 'text',
          ...(response.options ? { options: response.options } : {})
        });
      }
    }
  }, [
    userData,
    messages,
    addBotMessage,
    steps,
    addUserMessage,
    setUserData,
    chatbotConfig.initialSuggestions,
    chatbotConfig.messages,
    chatbotConfig.errorMessages
  ]);

  // Función para manejar el envío de mensajes
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || isLoading) return;

    addUserMessage(content, { type: 'text' });
    setIsLoading(true);

    try {
      await processUserInput(content, { skipUserMessage: false });
    } catch (error) {
      console.error('Error processing message:', error);
      await addBotMessage({
        content: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
        type: 'text'
      });
    } finally {
      setIsLoading(false);
    }
  }, [addUserMessage, processUserInput, isLoading, addBotMessage]);

  // Función para anunciar un mensaje del asistente desde fuera del hook
  const announce = useCallback(async (content: string, options?: MessageOptions) => {
    setIsOpen(true);
    await addBotMessage(content, options || { type: 'text' });
  }, [addBotMessage]);

  // Función para iniciar una nueva conversación
  const startNewConversation = useCallback(async () => {
    setMessages([]);
    setUserData({
      currentStep: steps.WELCOME,
      vehicles: [{}],
      currentVehicleIndex: 0,
    });
    conversationIdRef.current = uuidv4();
    await addBotMessage({
      content: chatbotConfig.welcomeMessage,
      type: 'suggestion',
      options: [...chatbotConfig.initialSuggestions]
    });
  }, [addBotMessage]);

  // Función para enviar datos del formulario
  const sendFormData = useCallback(async (data: Record<string, any>) => {
    setIsLoading(true);
    try {
      const formData = prepareFormData(data);
      // Aquí iría la lógica para enviar los datos al servidor
      console.log('Enviando datos del formulario:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular envío
      await addBotMessage({
        content: '¡Gracias! Hemos recibido tu información. Nos pondremos en contacto contigo pronto.',
        type: 'text'
      });
      return true;
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      await addBotMessage({
        content: 'Lo sentimos, ha ocurrido un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.',
        type: 'text'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [addBotMessage]);

  // Función para rastrear eventos
  const trackEvent = useCallback((eventName: string, data: Record<string, any> = {}) => {
    // Implementar lógica de seguimiento aquí
    console.log(`Evento: ${eventName}`, {
      ...data,
      conversationId: conversationIdRef.current,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Función para alternar la visibilidad del chat
  const toggleChat = useCallback(() => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      trackEvent('chat_opened');
      // Mostrar mensaje de bienvenida después de un pequeño retraso
      setTimeout(() => {
        showWelcomeMessage();
      }, 100);
    } else {
      trackEvent('chat_closed');
    }
  }, [isOpen, trackEvent, showWelcomeMessage]);

  // Valor de retorno del hook
  return useMemo(() => ({
    messages,
    isLoading,
    isOpen,
    userData,
    sendMessage,
    startNewConversation,
    sendFormData,
    toggleChat,
    announce,
  }), [messages, isLoading, isOpen, userData, sendMessage, startNewConversation, sendFormData, toggleChat, announce]);
};

export default useChatbot;
