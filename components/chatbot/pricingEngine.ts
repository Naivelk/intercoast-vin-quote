import { 
  estimatePriceFromConfig,
  calculateTotalEstimateFromConfig,
} from '../pricing/sharedRateConfig';

// Keep the same API surface used by the chatbot
export const calculateVehicleEstimate = (vehicle: any, _birthDate: string): number => {
  return estimatePriceFromConfig(vehicle);
};

export const calculateTotalEstimate = (vehicles: any[], _birthDate: string) => {
  return calculateTotalEstimateFromConfig(vehicles);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
};

export const prepareFormData = (userData: any) => {
  const { name, email, phone, birthDate, address, documentNumber, vehicles = [] } = userData;
  return {
    nombre: name,
    email,
    telefono: phone,
    fechaNacimiento: birthDate,
    direccion: address,
    documento: documentNumber,
    vehiculos: vehicles.map((v: any, index: number) => ({
      vin: v.vin || `N/A-${index}`,
      year: v.year || '',
      make: v.make || '',
      model: v.model || '',
      bodyClass: v.bodyClass || '',
      estimated: calculateVehicleEstimate(v, birthDate) || 0,
    })),
    totalEstimado: calculateTotalEstimate(vehicles, birthDate),
    timestamp: new Date().toISOString(),
  };
};