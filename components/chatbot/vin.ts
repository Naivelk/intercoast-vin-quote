export type VinDecoded = {
  year: string;
  make: string;
  model: string;
  bodyClass: string;
  vehicleType: string;
  fuelType: string;
  engineHP: string;
  engineCylinders: string;
  displacementL: string;
  driveType: string;
  transmissionStyle: string;
  transmissionSpeeds: string;
  doors: string;
  seats: string;
  gvwr: string;
  series: string;
  trim: string;
  plantCountry: string;
  plantCity: string;
};

export const isValidVIN = (vin: string): boolean => {
  if (typeof vin !== 'string') return false;
  const v = vin.trim().toUpperCase();
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(v);
};

async function fetchWithRetries(url: string, attempts = 3, backoffMs = 300): Promise<any> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastError = e;
      if (i < attempts - 1) {
        await new Promise(r => setTimeout(r, backoffMs * (i + 1)));
        continue;
      }
    }
  }
  throw lastError;
}

function cacheGet<T = any>(key: string): T | null {
  try {
    const v = sessionStorage.getItem(key);
    return v ? JSON.parse(v) as T : null;
  } catch {
    return null;
  }
}

function cacheSet(key: string, value: any) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function mapResultsToDict(results: any[]): Record<string, string> {
  const dict: Record<string, string> = {};
  (results || []).forEach((r: any) => {
    if (r.Variable && r.Value != null && r.Value !== "") dict[r.Variable] = r.Value;
  });
  return dict;
}

export async function decodeVIN2Steps(vin: string): Promise<VinDecoded> {
  const cacheKey = `VIN_CACHE_${vin}`;
  const cached = cacheGet<VinDecoded>(cacheKey);
  if (cached) return cached;

  const v = encodeURIComponent(vin);
  // 1) Discover year
  const r1 = await fetchWithRetries(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`, 3, 300);
  const dict1 = mapResultsToDict(r1.Results || []);
  const year = dict1["Model Year"];

  // 2) Row-style with (optional) modelyear for better accuracy
  const url2 = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${v}?format=json` + (year ? `&modelyear=${year}` : "");
  const r2 = await fetchWithRetries(url2, 3, 300);
  const row = (r2.Results && r2.Results[0]) ? r2.Results[0] : {};

  const result: VinDecoded = {
    year: row.ModelYear || dict1["Model Year"] || "",
    make: row.Make || dict1.Make || "",
    model: row.Model || dict1.Model || "",
    bodyClass: row.BodyClass || dict1["Body Class"] || "",
    vehicleType: row.VehicleType || "",
    fuelType: row.FuelTypePrimary || row["Fuel Type - Primary"] || "",
    engineHP: row.EngineHP || dict1["Engine HP"] || "",
    engineCylinders: row.EngineCylinders || "",
    displacementL: row.DisplacementL || "",
    driveType: row.DriveType || dict1["Drive Type"] || "",
    transmissionStyle: row.TransmissionStyle || "",
    transmissionSpeeds: row.TransmissionSpeeds || "",
    doors: row.Doors || "",
    seats: row.Seats || "",
    gvwr: row.GVWR || "",
    series: row.Series || "",
    trim: row.Trim || "",
    plantCountry: row.PlantCountry || "",
    plantCity: row.PlantCity || "",
  };
  cacheSet(cacheKey, result);
  return result;
}
