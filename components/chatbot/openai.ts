import OpenAI from 'openai';
import { ChatMessage } from './chatbot.types';

// Asegurarse de que TypeScript reconozca las variables de entorno
declare global {
  interface ImportMeta {
    env: {
      VITE_OPENAI_API_KEY: string;
    };
  }
}

// Obtener la clave de API de las variables de entorno de Vite
const apiKey = (import.meta as any).env.VITE_OPENAI_API_KEY as string;

if (!apiKey) {
  console.error('No se encontró la clave de API de OpenAI. Asegúrate de configurar VITE_OPENAI_API_KEY en tu archivo .env');
  throw new Error('Falta la clave de API de OpenAI');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Solo para desarrollo en el frontend
});

// Mapeo de respuestas predefinidas para consultas comunes
const predefinedResponses: Record<string, string> = {
  'hola': '¡Hola! Soy Eva, tu asistente de seguros. ¿En qué puedo ayudarte hoy?',
  'hola, necesito ayuda': '¡Hola! Claro, estoy aquí para ayudarte con lo que necesites sobre seguros. ¿Qué tipo de información buscas?',
  'gracias': '¡De nada! Si tienes más preguntas, no dudes en decírmelo. ¿Hay algo más en lo que pueda ayudarte?',
  'adios': '¡Hasta luego! Si tienes más preguntas en el futuro, estaré aquí para ayudarte. ¡Que tengas un excelente día!',
  'tipos de seguros': 'Ofrecemos varios tipos de seguros:\n\n' +
    '🚗 Seguro de Auto\n' +
    '🏠 Seguro de Hogar\n\n' +
    '¿Te gustaría más información sobre alguno en particular?',
  'documentos necesarios': 'Para cotizar tu seguro, necesitarás los siguientes documentos según el tipo de seguro:\n\n' +
    '📝 Identificación oficial (INE o pasaporte)\n' +
    '🚗 Para seguros de auto: licencia de conducir y tarjeta de circulación\n' +
    '🏠 Para seguros de hogar: comprobante de domicilio y escrituras (si aplica)',
  'cotizar seguro': '¡Perfecto! Para generar una cotización, necesitaré algunos datos. ¿Qué tipo de seguro te interesa? (auto u hogar)'
};

export async function getAIResponse(
  messages: ChatMessage[],
  userData: any
): Promise<string> {
  try {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    // Verificar si hay una respuesta predefinida
    const predefinedResponse = Object.entries(predefinedResponses).find(([key]) => 
      lastMessage.includes(key.toLowerCase())
    );
    
    if (predefinedResponse) {
      return predefinedResponse[1];
    }

    // Si es un mensaje muy corto o parece un saludo, responder localmente
    if (lastMessage.length < 5 || 
        /^(hola|holi|buenas|hey|ey|hi|hello|buenos|buenas|adios|chao|gracias?|thanks?)$/i.test(lastMessage)) {
      return predefinedResponses[lastMessage] || 
        '¿En qué puedo ayudarte hoy? Puedo ayudarte con cotizaciones de seguros, información sobre pólizas o responder tus dudas.';
    }

    // Si el mensaje es parte del flujo de cotización, manejarlo localmente
    if (userData && (userData.insuranceType || userData.name || userData.email)) {
      return 'Por favor, completa la información solicitada para continuar con tu cotización.';
    }

    // Si no hay respuesta predefinida y es un mensaje largo, usar OpenAI
    const systemMessage = {
      role: 'system' as const,
      content: `Eres Eva, un asistente virtual de seguros para Intercoast Insurance en California. 
      - Sé amable, profesional y conciso.
      - Si el usuario pregunta algo fuera del ámbito de seguros, responde amablemente que solo puedes ayudar con temas de seguros.
      - Para cotizaciones, pide un dato a la vez.`
    };

    const conversationHistory = messages.slice(-5).map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...conversationHistory],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('Error calling OpenAI API:', await response.json());
      return 'Lo siento, estoy teniendo problemas para procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.';
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No pude generar una respuesta en este momento. ¿Podrías reformular tu pregunta?';
    
  } catch (error) {
    console.error('Error:', error);
    return 'Lo siento, estoy teniendo problemas para procesar tu solicitud. ¿Podrías intentarlo de nuevo más tarde o ser más específico con tu consulta?';
  }
}

// Safe fallback with stricter guardrails (no prices/coverages invention)
export async function getAIResponseSafe(
  messages: ChatMessage[],
  userData: any
): Promise<string> {
  try {
    const systemMessage = {
      role: 'system' as const,
      content: `Eres Eva, asistente virtual de Intercoast Insurance (California).
      Reglas:
      - Sé breve, clara y amable.
      - NO inventes precios, tarifas o coberturas. Si no estás segura, pide permiso para conectar con un asesor.
      - No des valores numéricos específicos de primas ni promesas de cobertura.
      - Puedes explicar conceptos generales y pasos del proceso.
      - Si el usuario pide una cotización, guía a dar VIN y datos, paso a paso.
      - Responde en español neutro y agrega un cierre con ayuda opcional.`
    };
    const conversationHistory = messages.slice(-6).map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...conversationHistory],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      console.error('Error calling OpenAI API (safe):', await response.json());
      return 'Puedo explicarte de forma general o conectarte con un asesor si deseas detalles específicos de coberturas o precios.';
    }
    const data = await response.json();
    return data.choices[0]?.message?.content || '¿Quieres que te conecte con un asesor para una respuesta precisa?';
  } catch (e) {
    console.error('Error (safe):', e);
    return 'Puedo intentar explicarlo en términos generales o conectarte con un asesor.';
  }
}