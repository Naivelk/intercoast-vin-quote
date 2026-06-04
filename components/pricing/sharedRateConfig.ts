// Shared pricing configuration and helpers used by both the form and the chatbot

export type VehicleLike = {
  bodyClass?: string;
  make?: string;
  model?: string;
  year?: string;
  fuelType?: string;
  engineHP?: string;
  driveType?: string;
};

export const round5 = (x: number) => Math.round(x / 5) * 5;

// Canonicalize body class values coming from NHTSA so they align with pricing keys
export function canonicalBodyClass(bodyClass?: string): string {
  if (!bodyClass) return 'Other';
  const s = bodyClass.trim().toLowerCase();

  // Handle minivan before generic van
  if (s.includes('minivan') || s.includes('mini-van')) return 'Minivan';

  // Vans
  if (s === 'van' || s.includes('passenger van') || s.includes('cargo van') || (s.includes('van') && !s.includes('minivan'))) {
    return 'Van';
  }

  // SUVs and crossovers
  if (s.includes('crossover')) return 'Crossover';
  if (s.includes('suv') || s.includes('sport utility vehicle') || s.includes('sport utility')) return 'Sport Utility Vehicle (SUV)';

  // Pickups and trucks
  if (s.includes('pickup') || s.includes('pick-up') || (s.includes('truck') && s.includes('pickup'))) return 'Pickup';
  if (s.includes('truck')) return 'Truck';

  // Passenger cars
  if (s.includes('sedan') || s.includes('saloon')) return 'Sedan/Saloon';
  if (s.includes('hatchback')) return 'Hatchback';
  if (s.includes('wagon') || s.includes('estate')) return 'Wagon';
  if (s.includes('coupe')) return 'Coupe';
  if (s.includes('convertible') || s.includes('cabriolet') || s.includes('roadster') || s.includes('spider')) return 'Convertible';

  return 'Other';
}

// Pricing model matching the form's configuration
export const rateConfig = {
  baseByBodyClass: {
    'Sedan/Saloon': 67,
    'Hatchback': 59,
    'Wagon': 63,
    'Coupe': 69,
    'Convertible': 77,
    'Sport Utility Vehicle (SUV)': 73,
    'Crossover': 67,
    'Pickup': 79,
    'Van': 67,
    'Minivan': 63,
    'Truck': 79,
    'Luxury Sedan': 87,
    'Luxury SUV': 93,
    'Sports Car': 97,
    'Electric Vehicle': 77,
    'Hybrid': 67,
    'Other': 69,
  },
  modelOverrides: [
    // Económicos y populares
    { make: 'toyota', modelIncludes: ['corolla', 'camry', 'prius', 'yaris', 'avanza'], base: 65 },
    { make: 'honda', modelIncludes: ['civic', 'fit', 'hr-v', 'city'], base: 65 },
    { make: 'nissan', modelIncludes: ['versa', 'sentra', 'kicks'], base: 62 },
    { make: 'hyundai', modelIncludes: ['accent', 'elantra', 'venue'], base: 60 },
    { make: 'kia', modelIncludes: ['rio', 'forte', 'seltos'], base: 60 },

    // Híbridos
    { make: 'toyota', modelIncludes: ['prius', 'rav4 hybrid', 'camry hybrid', 'corolla hybrid'], base: 65 },
    { make: 'honda', modelIncludes: ['insight', 'accord hybrid', 'cr-v hybrid'], base: 68 },

    // SUVs
    { make: 'toyota', modelIncludes: ['rav4', 'highlander', 'fortuner'], base: 75 },
    { make: 'honda', modelIncludes: ['cr-v', 'pilot', 'passport'], base: 75 },
    { make: 'nissan', modelIncludes: ['rogue', 'xtrail', 'xtrail hybrid'], base: 72 },
    { make: 'mazda', modelIncludes: ['cx-5', 'cx-30', 'cx-9'], base: 70 },

    // Lujo alto / Superdeportivos
    { make: 'porsche', modelIncludes: ['911', 'taycan', 'panamera'], base: 349 },
    { make: 'ferrari', modelIncludes: ['f8', 'roma', 'sf90', 'purosangue'], base: 599 },
    { make: 'lamborghini', modelIncludes: ['huracan', 'urus', 'aventador'], base: 699 },
    { make: 'bentley', modelIncludes: ['bentayga', 'flying spur', 'continental'], base: 549 },
    { make: 'rolls-royce', modelIncludes: ['ghost', 'phantom', 'cullinan'], base: 999 },
    { make: 'mclaren', modelIncludes: ['720s', 'gt', 'artura'], base: 799 },
    { make: 'aston martin', modelIncludes: ['dbx', 'vantage', 'dbs'], base: 499 },

    // Lujo ejecutivo
    { make: 'mercedes', modelIncludes: ['s-class', 'e-class', 'gle', 'g-wagon', 'amg'], base: 299 },
    { make: 'bmw', modelIncludes: ['7', '5', 'x5', 'x7', 'm'], base: 279 },
    { make: 'audi', modelIncludes: ['a8', 'a7', 'a6', 'q7', 'q8', 'rs', 's'], base: 269 },
    { make: 'lexus', modelIncludes: ['ls', 'lx', 'gx', 'lc'], base: 249 },

    // Premium
    { make: 'mercedes', modelIncludes: ['c-class', 'glc', 'gla', 'a-class'], base: 219 },
    { make: 'bmw', modelIncludes: ['3', '4', 'x1', 'x3', 'x4'], base: 209 },
    { make: 'audi', modelIncludes: ['a3', 'a4', 'a5', 'q3', 'q5'], base: 199 },
    { make: 'lexus', modelIncludes: ['is', 'es', 'nx', 'rx', 'ux'], base: 189 },
    { make: 'acura', modelIncludes: ['tlx', 'rdx', 'mdx', 'integra'], base: 179 },
    { make: 'infiniti', modelIncludes: ['q50', 'q60', 'qx50', 'qx60'], base: 175 },

    // Eléctricos premium
    { make: 'porsche', modelIncludes: ['taycan'], base: 349 },
    { make: 'audi', modelIncludes: ['e-tron gt', 'rs e-tron'], base: 329 },
    { make: 'mercedes', modelIncludes: ['eqs', 'eqe', 'eqs suv'], base: 319 },
    { make: 'bmw', modelIncludes: ['i7', 'ix'], base: 309 },
    { make: 'lucid', modelIncludes: ['air'], base: 349 },
    { make: 'rivian', modelIncludes: ['r1t', 'r1s'], base: 299 },

    // Tesla
    { make: 'tesla', modelIncludes: ['model s', 'model x'], base: 297 },
    { make: 'tesla', modelIncludes: ['cybertruck'], base: 247 },
    { make: 'tesla', modelIncludes: ['model 3', 'model y'], base: 197 },

    // Eléctricos estándar premium
    { make: 'audi', modelIncludes: ['q4 e-tron', 'q8 e-tron'], base: 229 },
    { make: 'bmw', modelIncludes: ['i4', 'ix3'], base: 219 },
    { make: 'volvo', modelIncludes: ['ex90', 'ex30'], base: 209 },
    { make: 'cadillac', modelIncludes: ['lyriq'], base: 219 },

    // Eléctricos estándar
    { make: 'ford', modelIncludes: ['mustang mach-e', 'f-150 lightning'], base: 187 },
    { make: 'volkswagen', modelIncludes: ['id.4', 'id.buzz'], base: 177 },
    { make: 'hyundai', modelIncludes: ['ioniq 5', 'ioniq 6', 'kona electric'], base: 167 },
    { make: 'kia', modelIncludes: ['ev6', 'ev9', 'niro ev'], base: 167 },

    // Eléctricos de entrada y otros
    { make: 'nissan', modelIncludes: ['leaf', 'ariya'], base: 147 },
    { make: 'chevrolet', modelIncludes: ['bolt', 'blazer ev', 'equinox ev'], base: 147 },
    { make: 'volkswagen', modelIncludes: ['id.3'], base: 157 },
    { make: 'mini', modelIncludes: ['cooper se'], base: 167 },
    { make: 'mitsubishi', modelIncludes: ['mirage', 'outlander', 'eclipse cross'], base: 84 },
    { make: 'suzuki', modelIncludes: ['swift', 'sx4', 'grand vitara'], base: 79 },
  ],
  // Ajustadores con menor impacto en el precio final
  adjusters: {
    year: (y: string) => {
      const n = parseInt(y, 10);
      if (!n) return 1.0;
      if (n >= 2023) return 1.00;  // Muy nuevos: precio base
      if (n >= 2020) return 0.98;  // Recientes: 2% de descuento
      if (n >= 2018) return 0.95;  // 2018-2019: 5% de descuento
      if (n >= 2015) return 0.92;  // 2015-2017: 8% de descuento
      return 0.90;                 // Antiguos: 10% de descuento
    },
    fuel: (_f: string) => 1.0,
    engineHp: (hp: string) => {
      const n = parseInt(hp, 10);
      if (!n) return 1.0;
      if (n >= 400) return 1.05;  // Alto rendimiento: +5%
      if (n >= 300) return 1.02;  // Deportivos: +2%
      return 1.0;
    },
    driveType: (d: string) => {
      const t = (d || '').toLowerCase();
      if (t.includes('awd') || t.includes('4wd') || t.includes('4x4') || t.includes('all')) return 1.01;
      return 1.0;
    },
    modelHint: (m: string) => {
      const x = (m || '').toLowerCase();
      if (x.includes('turbo')) return 1.03;
      if (x.includes('hybrid')) return 1.01;
      if (x.includes('sport')) return 1.02;
      return 1.0;
    },
  },
};

export function estimatePriceFromConfig(v: VehicleLike): number {
  const make = (v.make || '').toLowerCase();
  const model = (v.model || '').toLowerCase();
  for (const o of rateConfig.modelOverrides) {
    if (make.includes(o.make) && o.modelIncludes.some(m => model.includes(m))) {
      return o.base;
    }
  }
  const key = canonicalBodyClass(v.bodyClass);
  let base = rateConfig.baseByBodyClass[key] || rateConfig.baseByBodyClass['Other'];
  base *= rateConfig.adjusters.year(v.year || '');
  base *= rateConfig.adjusters.fuel(v.fuelType || '');
  base *= rateConfig.adjusters.engineHp(v.engineHP || '');
  base *= rateConfig.adjusters.driveType(v.driveType || '');
  base *= rateConfig.adjusters.modelHint(v.model || '');
  return round5(base);
}

export function calculateTotalEstimateFromConfig(vehicles: VehicleLike[]): number {
  if (!vehicles || vehicles.length === 0) return 0;
  const cantidadVehiculos = vehicles.length;
  const estimadosIndividuales = vehicles.map(v => estimatePriceFromConfig(v));
  const estimadoTotal = estimadosIndividuales.reduce((a, b) => a + b, 0);

  let descuento = 0;
  if (cantidadVehiculos === 1) descuento = 0.05;
  else if (cantidadVehiculos === 2) descuento = 0.08;
  else if (cantidadVehiculos === 3) descuento = 0.12;
  else if (cantidadVehiculos === 4) descuento = 0.15;
  else if (cantidadVehiculos >= 5) descuento = 0.18;

  const luxuryBrands = ['tesla','porsche','ferrari','lamborghini','bentley','rolls-royce','mclaren','aston martin','mercedes','bmw','audi'];
  const tieneVehiculoLujo = vehicles.some((v, idx) => {
    const make = (v.make || '').toLowerCase();
    const isLuxuryBrand = luxuryBrands.some(m => make.includes(m));
    return isLuxuryBrand || (estimadosIndividuales[idx] || 0) > 300;
  });
  if (tieneVehiculoLujo) descuento *= 0.5;

  const descuentoAdicionalPorVehiculo = 0.01; // +1% por vehículo adicional
  const maxDescuento = tieneVehiculoLujo ? 0.25 : 0.30;
  const descuentoAdicional = Math.min(
    (cantidadVehiculos - 1) * descuentoAdicionalPorVehiculo,
    maxDescuento - descuento
  );
  descuento = Math.min(descuento + descuentoAdicional, maxDescuento);

  // Asegurar mínimo de $40 promedio por vehículo
  const precioPromedioConDescuento = (estimadoTotal * (1 - descuento)) / cantidadVehiculos;
  if (precioPromedioConDescuento < 40) {
    descuento = 1 - (40 * cantidadVehiculos / estimadoTotal);
    descuento = Math.max(0, Math.min(descuento, maxDescuento));
  }

  const totalConDescuento = Math.round((estimadoTotal * (1 - descuento)) * 100) / 100;
  return totalConDescuento;
}
