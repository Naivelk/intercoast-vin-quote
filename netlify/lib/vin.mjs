const VPIC_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles";

export const normalizeVin = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

export const isValidVin = (value) =>
  /^[A-HJ-NPR-Z0-9]{17}$/.test(normalizeVin(value));

const valuesByLabel = (results) => {
  const values = {};
  for (const item of results || []) {
    if (item?.Variable && item.Value != null && item.Value !== "") {
      values[item.Variable] = String(item.Value);
    }
  }
  return values;
};

const fetchJsonWithRetries = async (url, fetchImpl, attempts = 3) => {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`NHTSA_HTTP_${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 250 * (attempt + 1)),
        );
      }
    }
  }
  throw lastError;
};

/**
 * Implementación canónica reutilizada del cotizador de Intercoast.
 * Devuelve solamente campos útiles para operación; nunca persiste ni loguea el VIN.
 */
export async function decodeVin(value, fetchImpl = fetch) {
  const vin = normalizeVin(value);
  if (!isValidVin(vin)) {
    return { ok: false, error: "VIN_INVALIDO" };
  }

  const first = await fetchJsonWithRetries(
    `${VPIC_BASE}/decodevin/${encodeURIComponent(vin)}?format=json`,
    fetchImpl,
  );
  const labels = valuesByLabel(first.Results);
  const year = labels["Model Year"] || "";
  const extended = await fetchJsonWithRetries(
    `${VPIC_BASE}/decodevinvaluesextended/${encodeURIComponent(vin)}?format=json${year ? `&modelyear=${encodeURIComponent(year)}` : ""}`,
    fetchImpl,
  );
  const row = extended.Results?.[0] || {};
  const errorCode = String(row.ErrorCode || labels["Error Code"] || "").trim();
  const errorText = String(row.ErrorText || labels["Error Text"] || "").trim();
  const vehicle = {
    year: String(row.ModelYear || labels["Model Year"] || ""),
    make: String(row.Make || labels.Make || ""),
    model: String(row.Model || labels.Model || ""),
    trim: String(row.Trim || ""),
    series: String(row.Series || ""),
    manufacturer: String(row.Manufacturer || labels.Manufacturer || ""),
    bodyClass: String(row.BodyClass || labels["Body Class"] || ""),
    vehicleType: String(row.VehicleType || ""),
    fuelType: String(row.FuelTypePrimary || ""),
    engineCylinders: String(row.EngineCylinders || ""),
    displacementL: String(row.DisplacementL || ""),
    driveType: String(row.DriveType || labels["Drive Type"] || ""),
    doors: String(row.Doors || ""),
    gvwr: String(row.GVWR || ""),
    plantCountry: String(row.PlantCountry || ""),
  };
  const decoded = Boolean(vehicle.year && vehicle.make && vehicle.model);

  return {
    ok: true,
    vin,
    decoded,
    source: "NHTSA vPIC",
    vehicle,
    warning: decoded || !errorText ? "" : errorText,
    errorCode,
  };
}
