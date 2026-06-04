// Definir los pasos del chatbot como una constante separada
export const steps = {
  WELCOME: 'welcome',
  ASK_INSURANCE_TYPE: 'ask_insurance_type',
  POLICY_MENU: 'policy_menu',
  POLICY_DETAIL: 'policy_detail',
  ASK_NAME: 'ask_name',
  ASK_EMAIL: 'ask_email',
  ASK_PHONE: 'ask_phone',
  ASK_BIRTHDATE: 'ask_birthdate',
  ASK_ADDRESS: 'ask_address',
  ASK_DOCUMENT: 'ask_document',
  ASK_VEHICLE_COUNT: 'ask_vehicle_count',
  COLLECT_VEHICLE_INFO: 'collect_vehicle_info',
  ASK_ANOTHER_VEHICLE: 'ask_another_vehicle',
  CONFIRM_QUOTE: 'confirm_quote',
  FINISH: 'finish'
} as const;

// Exportar el tipo de los pasos
export type ChatbotStep = keyof typeof steps;
export type ChatbotStepValue = typeof steps[ChatbotStep];

export const isChatbotStep = (step: string): step is ChatbotStepValue => {
  return Object.values(steps).includes(step as any);
};

export const config = {
  welcomeMessage: "¡Hola! Soy Eva. ¿Te ayudo a cotizar tu seguro de auto o a contactarnos?",
  initialSuggestions: [
    "Cotizar seguro de auto 🚗",
    "Ver tipos de pólizas 📋",
    "Oficinas y contacto 📍"
  ] as const,
  maxMessageLength: 500,
  maxVehicles: 5,
  // Opciones de tipos de pólizas presentadas como botones/sugerencias
  policyOptions: [
    'Seguro de Auto 🚗',
    'Seguro de Hogar 🏠',
    'Volver al inicio ⬅️',
  ] as const,
  theme: {
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    botBubbleColor: "#f3f4f6",
    userBubbleColor: "#2563eb",
    botTextColor: "#1f2937",
    userTextColor: "#ffffff",
  },
  steps,
  messages: {
    // Menú de pólizas
    policyMenuPrompt: 'Selecciona una póliza para ver más información:',
    policyMoreInfoPrompt: '¿Sobre cuál póliza te gustaría saber más?',
    backToMenu: 'Volver al inicio ⬅️',
    seeOtherPolicies: 'Ver otra póliza 📋',
    quoteThisPolicy: 'Cotizar seguro de auto 🚗',

    // Detalles por póliza (sin usar * para bullets)
    autoPolicyInfo:
      '🚗 Seguro de Auto\n' +
      'Cobertura contra daños, robo, responsabilidad civil y asistencia en carretera. Opciones de deducible flexible y descuentos por buen historial.\n' +
      '¿Qué deseas hacer ahora?',
    homePolicyInfo:
      '🏠 Seguro de Hogar\n' +
      'Protege tu vivienda y pertenencias frente a incendios, robos, responsabilidad civil y fenómenos naturales (según plan).\n' +
      '¿Qué deseas hacer ahora?',
    // Eliminadas pólizas de Vida y Salud para este flujo

    askName: "¿Cuál es tu nombre completo?",
    askEmail: "¿Cuál es tu correo electrónico?",
    askPhone: "¿Cuál es tu número de teléfono?",
    askBirthdate: "¿Cuál es tu fecha de nacimiento? (MM/DD/AAAA)",
    askAddress: "¿Cuál es tu dirección completa en California?",
    askDocument: "¿Cuál es tu número de identificación o licencia de conducir?",
    askVehicleCount: `¿Cuántos vehículos deseas asegurar? (Máximo 5)`, 
    askVehicleVin: (index: number) => `Por favor ingresa el VIN del vehículo ${index + 1} (o escribe 'no sé' si no lo tienes a mano)`,
    askVehicleYear: (index: number) => `¿De qué año es el vehículo ${index + 1}?`,
    askVehicleMake: (index: number) => `¿Qué marca es el vehículo ${index + 1}? (Ej: Toyota, Honda, etc.)`,
    askVehicleModel: (index: number) => `¿Qué modelo es el vehículo ${index + 1}?`,
    askVehicleBodyClass: (index: number) => `¿Qué tipo de vehículo es el ${index + 1}? (Ej: Sedán, Camioneta, SUV, etc.)`,
    confirmQuote: (price: number) => `¡Perfecto! Basado en la información proporcionada, tu cotización estimada es de $${price.toFixed(2)} al mes. ¿Deseas proceder con esta cotización?`,
    finish: "¡Listo! Hemos recibido tu solicitud. Uno de nuestros agentes se pondrá en contacto contigo en breve para finalizar el proceso. ¿Hay algo más en lo que pueda ayudarte?"
  },
  errorMessages: {
    invalidEmail: "Por favor ingresa un correo electrónico válido.",
    invalidPhone: "Por favor ingresa un número de teléfono válido.",
    invalidBirthdate: "Por favor ingresa una fecha de nacimiento válida (MM/DD/AAAA).",
    invalidVehicleCount: `Por favor ingresa un número entre 1 y 5.`,
    invalidYear: "Por favor ingresa un año válido (ej: 2020).",
    requiredField: "Este campo es obligatorio.",
    genericError: "Lo siento, ha ocurrido un error. Por favor intenta de nuevo más tarde."
  }
} as const;
