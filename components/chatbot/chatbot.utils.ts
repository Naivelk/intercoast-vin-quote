/**
 * Utilidades para el chatbot
 */

import { ChatMessage, UserData } from './chatbot.types';
import { config as chatbotConfig } from './chatbot.config';

/**
 * Verifica si un mensaje es una opción de sugerencia
 */
export const isSuggestionMessage = (message: ChatMessage): boolean => {
  return message.metadata?.type === 'suggestion' && Array.isArray(message.metadata.options);
};

/**
 * Formatea un número de teléfono a un formato estándar
 */
export const formatPhoneNumber = (phone: string): string => {
  // Eliminar todo lo que no sea número
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Verificar si el número tiene el código de país, si no, asumir +1 (EE.UU.)
  const match = cleaned.match(/^(\d{1,3})?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]}` : '+1';
    return `${intlCode} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  
  return phone; // Devolver el original si no coincide con el formato esperado
};

/**
 * Formatea una fecha a un formato legible
 */
export const formatDate = (dateString: string): string => {
  // Espera formato MM/DD/YYYY y lo muestra friendly en español
  try {
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString; // Devolver el original si hay un error
  }
};

/**
 * Genera un resumen de los datos del usuario para mostrar en la conversación
 */
export const generateUserDataSummary = (userData: UserData): string => {
  const { name, email, phone, birthDate, address, documentNumber, vehicles = [] } = userData;
  
  let summary = '**Resumen de tus datos:**\n\n';
  
  if (name) summary += `👤 **Nombre:** ${name}\n`;
  if (email) summary += `📧 **Email:** ${email}\n`;
  if (phone) summary += `📱 **Teléfono:** ${formatPhoneNumber(phone)}\n`;
  if (birthDate) summary += `📅 **Fecha de nacimiento:** ${formatDate(birthDate)}\n`;
  if (address) summary += `🏠 **Dirección:** ${address}\n`;
  if (documentNumber) summary += `📝 **Documento:** ${documentNumber}\n`;
  
  if (vehicles.length > 0) {
    summary += '\n**Vehículos:**\n';
    vehicles.forEach((vehicle, index) => {
      if (vehicle.make || vehicle.model || vehicle.year) {
        summary += `\n🚗 **Vehículo ${index + 1}**\n`;
        if (vehicle.year && vehicle.make && vehicle.model) {
          summary += `   - ${vehicle.year} ${vehicle.make} ${vehicle.model}\n`;
        }
        if (vehicle.vin) summary += `   - VIN: ${vehicle.vin}\n`;
        if (vehicle.bodyClass) summary += `   - Tipo: ${vehicle.bodyClass}\n`;
      }
    });
  }
  
  return summary;
};

/**
 * Calcula el precio estimado basado en los datos del usuario
 * Esta es una función de ejemplo - deberías reemplazarla con tu lógica de cálculo real
 */
export const calculateEstimatedPrice = (userData: UserData): number => {
  // Precio base
  let basePrice = 0;
  
  // Ajustes por tipo de seguro
  switch (userData.insuranceType) {
    case 'auto':
      basePrice = 80; // Precio base mensual para seguro de auto
      break;
    case 'home':
      basePrice = 100; // Precio base mensual para seguro de hogar
      break;
    case 'motorcycle':
      basePrice = 60; // Precio base mensual para seguro de moto
      break;
    case 'boat':
      basePrice = 150; // Precio base mensual para seguro de bote
      break;
    default:
      basePrice = 80; // Precio por defecto
  }
  
  // Ajuste por cantidad de vehículos (solo para seguros de auto/moto)
  if ((userData.insuranceType === 'auto' || userData.insuranceType === 'motorcycle') && userData.vehicles) {
    const vehicleCount = userData.vehicles.length;
    if (vehicleCount > 1) {
      // Descuento por múltiples vehículos
      basePrice = basePrice * (1 + (vehicleCount - 1) * 0.7); // 30% de descuento en vehículos adicionales
    }
  }
  
  // Ajuste por edad (ejemplo simplificado)
  if (userData.birthDate) {
    const [month, day, year] = userData.birthDate.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    
    if (age < 25) {
      basePrice *= 1.3; // 30% más para menores de 25
    } else if (age > 60) {
      basePrice *= 1.2; // 20% más para mayores de 60
    }
  }
  
  // Redondear a 2 decimales
  return Math.round(basePrice * 100) / 100;
};

/**
 * Valida si un VIN (Número de Identificación del Vehículo) es válido
 * Nota: Esta es una validación básica, el estándar VIN real es más complejo
 */
export const isValidVIN = (vin: string): boolean => {
  if (!vin) return false;
  
  // Eliminar espacios y convertir a mayúsculas
  const cleanedVIN = vin.trim().toUpperCase();
  
  // Un VIN válido tiene entre 11 y 17 caracteres alfanuméricos
  if (!/^[A-HJ-NPR-Z0-9]{11,17}$/.test(cleanedVIN)) {
    return false;
  }
  
  // Aquí podrías agregar más validaciones según el estándar VIN
  
  return true;
};

/**
 * Obtiene el siguiente paso en el flujo de conversación
 */
export const getNextStep = (currentStep: string, userData: UserData): string => {
  const { steps } = chatbotConfig;
  
  switch (currentStep) {
    case steps.WELCOME:
      return steps.ASK_INSURANCE_TYPE;
    case steps.ASK_INSURANCE_TYPE:
      return steps.ASK_NAME;
    case steps.ASK_NAME:
      return steps.ASK_EMAIL;
    case steps.ASK_EMAIL:
      return steps.ASK_PHONE;
    case steps.ASK_PHONE:
      return steps.ASK_BIRTHDATE;
    case steps.ASK_BIRTHDATE:
      return steps.ASK_ADDRESS;
    case steps.ASK_ADDRESS:
      return steps.ASK_DOCUMENT;
    case steps.ASK_DOCUMENT:
      return steps.ASK_VEHICLE_COUNT;
    case steps.ASK_VEHICLE_COUNT:
      return steps.COLLECT_VEHICLE_INFO;
    case steps.COLLECT_VEHICLE_INFO:
      // Verificar si hay más vehículos por procesar
      const vehicleCount = userData.vehicles?.length || 0;
      const currentVehicleIndex = userData.currentVehicleIndex || 0;
      
      if (currentVehicleIndex < vehicleCount - 1) {
        // Hay más vehículos por procesar
        return steps.ASK_ANOTHER_VEHICLE;
      } else {
        // Todos los vehículos han sido procesados
        return steps.CONFIRM_QUOTE;
      }
    case steps.CONFIRM_QUOTE:
      return steps.FINISH;
    default:
      return steps.WELCOME;
  }
};

/**
 * Prepara los datos del formulario para ser enviados al endpoint
 */
export const prepareFormData = (userData: UserData): Record<string, any> => {
  const { name, email, phone, birthDate, address, documentNumber, insuranceType, vehicles = [] } = userData;
  
  // Formatear la fecha de nacimiento para el formato esperado por el backend
  let formattedBirthDate = '';
  if (birthDate) {
    // birthDate esperado en formato MM/DD/YYYY
    const [month, day, year] = birthDate.split('/');
    formattedBirthDate = `${year}-${(month || '').padStart(2, '0')}-${(day || '').padStart(2, '0')}`;
  }
  
  // Preparar datos del formulario
  const formData: Record<string, any> = {
    nombre: name,
    email,
    telefono: phone,
    nacimiento: formattedBirthDate,
    direccion: address,
    documento: documentNumber,
    tipoSeguro: insuranceType,
    cantidadVehiculos: vehicles.length,
    totalEstimado: calculateEstimatedPrice(userData),
  };
  
  // Agregar datos de cada vehículo
  vehicles.forEach((vehicle, index) => {
    formData[`vehiculo${index}`] = JSON.stringify({
      vin: vehicle.vin || '',
      year: vehicle.year || '',
      make: vehicle.make || '',
      model: vehicle.model || '',
      bodyClass: vehicle.bodyClass || '',
      estimated: 0, // Este valor se calculará en el backend
    });
  });
  
  // Agregar datos de UTM si están disponibles
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmParams.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      formData[param] = value;
    }
  });
  
  // Agregar referrer
  formData.referrer = document.referrer || '';
  
  return formData;
};
