import { getUser } from "@netlify/identity";

const ALLOWED_EMAILS = new Set([
  "intercoast.texto@gmail.com",
  "alequito09@hotmail.com",
]);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, max-age=120, stale-while-revalidate=300",
    },
  });

const memory = globalThis.__intercoastCalendarCache || new Map();
globalThis.__intercoastCalendarCache = memory;

export default async (request) => {
  const user = await getUser();
  const email = String(user?.email || "").toLowerCase();
  if (!ALLOWED_EMAILS.has(email)) {
    return json(403, { error: "No tienes acceso al calendario." });
  }

  const incoming = new URL(request.url);
  const start = incoming.searchParams.get("start") || "";
  const end = incoming.searchParams.get("end") || "";
  const force = incoming.searchParams.get("force") === "1";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const range = endDate.getTime() - startDate.getTime();
  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    range <= 0 ||
    range > 15 * 86400000
  ) {
    return json(400, { error: "Rango de calendario inválido." });
  }

  const key = `${startDate.toISOString()}|${endDate.toISOString()}`;
  const cached = memory.get(key);
  if (!force && cached && Date.now() - cached.savedAt < 5 * 60 * 1000) {
    return json(200, { ...cached.data, cached: true });
  }

  try {
    const base = process.env.INTERCOAST_BOT_API_URL;
    const token = process.env.INTERCOAST_CALENDAR_PANEL_TOKEN;
    if (!base) throw new Error("El calendario no está configurado.");
    if (!token) throw new Error("El acceso privado al calendario no está configurado.");
    const target = new URL(base);
    /* La URL heredada trae la clave del endpoint de diagnósticos. Este puente
     * no la usa ni la reenvía: el calendario contiene títulos de clientes y
     * se protege con una credencial exclusiva que viaja solo por POST. */
    target.searchParams.delete("key");
    target.searchParams.delete("fn");
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "panelCalendar",
        token,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      }),
      signal: AbortSignal.timeout(55000),
    });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error("Google Calendar devolvió una respuesta inválida.");
    }
    const data = await response.json();
    if (!data.ok)
      throw new Error(data.error || "Google Calendar no respondió.");
    memory.set(key, { data, savedAt: Date.now() });
    return json(200, { ...data, cached: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error(`Admin calendar error: ${message}`);
    if (cached) return json(200, { ...cached.data, cached: true, stale: true });
    return json(502, { error: `No se pudo cargar el calendario: ${message}` });
  }
};
