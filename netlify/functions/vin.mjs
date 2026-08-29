import { createHash } from "node:crypto";
import { getUser } from "@netlify/identity";
import { decodeVin, isValidVin, normalizeVin } from "../lib/vin.mjs";

const ALLOWED_EMAILS = new Set([
  "intercoast.texto@gmail.com",
  "alequito09@hotmail.com",
]);
const TTL_MS = 24 * 60 * 60 * 1000;
const memory = new Map();

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
    },
  });

export default async (request) => {
  const user = await getUser();
  const email = String(user?.email || "").toLowerCase();
  if (!ALLOWED_EMAILS.has(email)) {
    return json(403, { error: "No tienes acceso a esta herramienta." });
  }
  if (request.method !== "POST") {
    return json(405, { error: "Método no permitido." });
  }

  try {
    const body = await request.json();
    const vin = normalizeVin(body?.vin);
    if (!isValidVin(vin)) {
      return json(400, {
        error: "El VIN debe tener 17 caracteres y no puede contener I, O o Q.",
      });
    }

    // La llave evita conservar el VIN como texto en el caché efímero del proceso.
    const cacheKey = createHash("sha256").update(vin).digest("hex");
    const cached = memory.get(cacheKey);
    if (cached && Date.now() - cached.savedAt < TTL_MS) {
      return json(200, { ...cached.data, cached: true });
    }

    const data = await decodeVin(vin);
    if (!data.ok) return json(400, { error: "El VIN no es válido." });
    memory.set(cacheKey, { savedAt: Date.now(), data });
    return json(200, { ...data, cached: false });
  } catch (error) {
    // No registrar el VIN ni el cuerpo: es un identificador del vehículo.
    console.error("VIN decode failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return json(502, {
      error: "NHTSA no respondió. Intenta de nuevo en unos minutos.",
    });
  }
};
