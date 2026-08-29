export type FaqEntry = {
  id: string;
  questions: string[]; // synonyms or triggers (lowercased)
  answer: string; // plain text with newlines; emojis allowed
  options?: string[]; // suggestion buttons
  scope?: 'auto' | 'home' | 'life' | 'health' | 'general' | 'about';
};

// Helper to lc and trim
const lc = (s: string) => (s || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// About info (Quiénes somos)
const ABOUT_ANSWER =
  'Somos Intercoast Insurance. Estamos en South Gate y Compton y te ayudamos a asegurar tu auto en California de forma clara y rápida. 😊\n\n' +
  '• General Manager: Alejandro Quimbaya Tobón\n' +
  '• Oficinas: 5863 Imperial Hwy (South Gate) · 920 N Long Beach Blvd I (Compton)\n' +
  '• Teléfonos: +1 (562) 381-2012 · +1 (424) 417-1700 · WhatsApp: +1 (775) 675-4559\n' +
  '• Idiomas: Español (atención bilingüe)\n\n' +
  '¿Te paso la info completa o prefieres que coticemos de una vez?';

const ABOUT_ANSWER_EXTENDED =
  '🏢 Intercoast Insurance es una agencia de seguros con presencia en South Gate y Compton dedicada a facilitarte la vida al asegurar tu vehículo en California. Creemos en la claridad, la cercanía y la rapidez: comparamos opciones entre diversas aseguradoras, te explicamos cada cobertura en español y priorizamos precios competitivos —especialmente en Liability— para que tomes decisiones informadas sin complicaciones.\n\n' +
  'Te acompañamos en renovaciones, identificando oportunidades de descuento (multi-auto, buen historial, pago automático, etc.) y evitando lapsos de cobertura que puedan elevar tu prima. Cuando corresponde, te asesoramos en SR-22. Nuestro proceso es ágil: contacto → verificación → comparación → pago → documentos digitales.\n\n' +
  'Operamos desde: 5863 Imperial Hwy, South Gate, CA 90280 y 920 N Long Beach Blvd I, Compton, CA 90221.\n' +
  'General Manager: Alejandro Quimbaya Tobón.\n' +
  'Tel: +1 (562) 381-2012 · +1 (424) 417-1700 · WhatsApp: +1 (775) 675-4559.\n' +
  'Nota: Coberturas y precios están sujetos a aprobación de la aseguradora y a la normativa del estado.';

export const FAQ: FaqEntry[] = [
  {
    id: 'about',
    scope: 'about',
    questions: [
      'quienes son', 'quiénes son', 'quien es intercoast', 'intercoast insurance', 'about', 'quienes somos', 'quiénes somos',
      'dirección', 'direccion', 'teléfono', 'telefono', 'whatsapp', 'oficinas', 'horarios', 'general manager', 'alejandro quimbaya'
    ],
    answer: ABOUT_ANSWER,
    options: ['Ver versión extendida 📄', 'Llamar 📞', 'WhatsApp 💬', 'Cotizar seguro de auto 🚗', 'Ver tipos de pólizas 📋', '¿Qué puedo preguntar? ❓', 'Volver al inicio ⬅️']
  },
  {
    id: 'about-extended',
    scope: 'about',
    questions: ['version extendida', 'versión extendida', 'ver más detalles', 'ver mas detalles', 'más info', 'mas info'],
    answer: ABOUT_ANSWER_EXTENDED,
    options: ['Llamar 📞', 'WhatsApp 💬', 'Cotizar seguro de auto 🚗', '¿Qué puedo preguntar? ❓', 'Volver al inicio ⬅️']
  },
  {
    id: 'help-index',
    scope: 'general',
    questions: [
      'que puedo preguntar', 'qué puedo preguntar', 'ayuda', 'faq', 'preguntas frecuentes', 'temas', 'opciones', 'menu de ayuda', 'menú de ayuda', 'que hace eva', 'qué hace eva'
    ],
    answer: 'Puedo ayudarte con varias cosas. Aquí tienes ideas de preguntas (puedes escribirlas tal cual):\n\n' +
      '❓ Cotización: "Quiero cotizar un seguro de auto"\n' +
      '💸 Descuentos: "¿Qué descuentos aplican?"\n' +
      '📄 Renovaciones/SR-22: "¿Me ayudan a renovar?" / "¿Tramitan SR-22?"\n' +
      '🆘 Siniestros: "¿Cómo reporto un siniestro?"\n' +
      '📍 Oficinas/Contacto: "¿Dónde están?" / "¿Teléfono?"\n' +
      '📋 Requisitos: "¿Qué documentos necesito?"',
    options: ['Cotizar seguro de auto 🚗', 'Descuentos 💸', 'Renovaciones/SR-22 📄', 'Oficinas/Contacto 📍', 'Reportar siniestro 🆘', 'Volver al inicio ⬅️']
  },
  {
    id: 'discounts',
    scope: 'auto',
    questions: ['descuentos', 'descuento', 'multi-auto', 'multi auto', 'buen historial', 'pago automático', 'pago automatico', 'estudiante', 'buen conductor'],
    answer: 'Buscamos ahorros con: multi-auto, buen historial, pago automático y otros según aseguradora. Te mostramos el impacto en tu cotización para decidir juntos.',
    options: ['¿Cotizamos con descuentos? 💸', 'Ver tipos de pólizas 📋', 'Volver al inicio ⬅️']
  },
  {
    id: 'renewals',
    scope: 'auto',
    questions: ['renovaciones', 'renovar', 'renovación', 'renovacion', 'vencimiento', 'se vence', 'se vencio', 'vence mi seguro', 'expira', 'lapse', 'cambiar aseguradora', 'cambiar de aseguradora'],
    answer: 'Te ayudamos a renovar revisando coberturas y comparando entre aseguradoras para evitar lapsos que suben la prima. Si conviene cambiar de compañía, te lo proponemos.',
    options: ['Cotizar renovación 🔄', 'SR-22 📄', 'Llamar 📞', 'WhatsApp 💬', 'Volver al inicio ⬅️']
  },
  {
    id: 'auto-coverages',
    scope: 'auto',
    questions: ['qué cubre auto', 'que cubre auto', 'cobertura auto', 'cubre mi auto', 'que incluye el seguro de auto'],
    answer: 'Cobertura típica: responsabilidad civil (terceros), daños al vehículo (según plan), robo y asistencia en carretera. Te detallo límites y deducibles en tu propuesta.'
  },
  {
    id: 'auto-exclusions',
    scope: 'auto',
    questions: ['qué no cubre auto', 'no cubre auto', 'exclusiones auto', 'que no cubre el seguro de auto'],
    answer: 'No cubre desgaste mecánico, carreras, conductor sin licencia válida, ni eventos fuera del plan. Las exclusiones exactas dependen de la aseguradora.'
  },
  { id: 'sr22', scope: 'auto', questions: ['sr-22', 'sr22', 'sr 22'], answer: 'Podemos asesorarte en SR-22 cuando corresponde. Lo incluimos en tu propuesta y te guiamos en el proceso.' },
  { id: 'foreign-license', scope: 'auto', questions: ['licencia extranjera', 'licencia de otro país', 'sin licencia usa'], answer: 'En muchos casos puedes asegurar con licencia extranjera vigente. Verificamos con la aseguradora al armar tu propuesta.' },
  { id: 'report-claim', scope: 'general', questions: ['reporte siniestro', 'reporto siniestro', 'reportar siniestro', 'cómo reporto siniestro', 'como reporto siniestro', 'tuve un accidente', 'choque', 'choqué', 'me chocaron', 'crash'], answer: 'Si tuviste un accidente, verifica primero que todos estén a salvo y llama al 911 si hay heridos o peligro. Después podemos orientarte con tu póliza y asistencia. ¿Quieres hablar con un asesor?' },
  { id: 'multi-vehicle-discount', scope: 'auto', questions: ['descuento varios autos', 'varios autos descuento', 'multi auto', 'dos carros', 'dos autos', 'varios carros', 'asegurar 2 autos'], answer: 'Sí, aplicamos descuento progresivo por múltiples vehículos y te mostramos el total combinado con el ahorro.' },
  { id: 'home-catastrophe', scope: 'home', questions: ['sismo', 'inundación', 'inundacion', 'catastrofica'], answer: 'Depende del plan/aseguradora. Hay añadidos catastróficos. Si te interesa, lo incluyo en la propuesta.' },
  { id: 'home-offsite', scope: 'home', questions: ['bienes portátiles', 'fuera de casa', 'portatiles'], answer: 'Algunos planes cubren bienes fuera del hogar con sublímites. Puedo proponerte un plan con esta extensión.' },
  { id: 'home-requirements', scope: 'home', questions: ['rejas', 'alarmas', 'requisitos hogar'], answer: 'Varias aseguradoras mejoran tarifa si hay rejas, alarmas o medidas de seguridad. Lo reflejo en tu propuesta si aplica.' },
  { id: 'life-preexist', scope: 'life', questions: ['beneficiarios', 'carencia', 'preexistencias vida'], answer: 'Puedes asignar beneficiarios libremente. Puede haber periodos de carencia y evaluación de preexistencias según el plan.' },
  { id: 'health-network', scope: 'health', questions: ['red de clínicas', 'red de clinicas', 'clínicas', 'clinicas', 'preexistencias', 'copago', 'copagos', 'deducible salud'], answer: 'La red y condiciones (copagos/deducibles) dependen del plan. Al confirmar interés, te paso la red vigente y detallo condiciones.' },
  { id: 'payment-monthly', scope: 'general', questions: ['pagar mensual', 'pago mensual', 'mensualidades'], answer: 'En la mayoría de pólizas puedes pagar mensual con tarjeta o débito automático. Te muestro opciones al confirmar.' },
  { id: 'deductible', scope: 'general', questions: ['hay deducible', 'deducible'], answer: 'Daños propios normalmente tiene deducible; responsabilidad civil (terceros) usualmente no. Te indico el detalle en la propuesta.' },
  { id: 'issuance-time', scope: 'general', questions: ['cuánto tarda', 'cuanto tarda', 'tarda la emisión', 'tarda la emision'], answer: 'Usualmente 24–48h hábiles tras confirmar datos y pago. Si urge, priorizo tu caso.' },
  { id: 'no-vin', scope: 'auto', questions: ['no tengo el vin', 'sin vin', 'no se vin', 'no sé vin'], answer: 'Sin el VIN el precio es tentativo. Ubicaciones: tablero (lado conductor), marco de la puerta del conductor, y registro del vehículo. Cuando lo tengas, lo ajustamos.' },
];

export function resolveFaq(lower: string): FaqEntry | null {
  const q = lc(lower);
  for (const e of FAQ) {
    for (const trig of e.questions) {
      if (q.includes(lc(trig))) return e;
    }
  }

  // Second pass: recognize natural wording that communicates an intent even
  // when it does not exactly match a FAQ phrase.
  const intentKeywords: Record<string, string[]> = {
    'report-claim': ['accidente', 'choque', 'chocar', 'golpearon'],
    renewals: ['vence', 'vencida', 'expira', 'renovacion'],
    'multi-vehicle-discount': ['dos autos', 'dos carros', 'varios autos', 'varios carros'],
    sr22: ['sr22', 'sr 22'],
    'foreign-license': ['licencia extranjera', 'licencia de mi pais'],
  };
  for (const [id, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some((keyword) => q.includes(keyword))) {
      return FAQ.find((entry) => entry.id === id) || null;
    }
  }
  return null;
}
