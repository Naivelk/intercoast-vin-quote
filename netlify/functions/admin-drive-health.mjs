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
      "Cache-Control": "private, max-age=300, stale-while-revalidate=900",
    },
  });

const memory = globalThis.__intercoastDriveHealthCache || new Map();
globalThis.__intercoastDriveHealthCache = memory;

export default async (request) => {
  const user = await getUser();
  const email = String(user?.email || "").toLowerCase();
  if (!ALLOWED_EMAILS.has(email))
    return json(403, { error: "No tienes acceso a la salud de Drive." });

  const force = new URL(request.url).searchParams.get("force") === "1";
  const cached = memory.get("drive");
  if (!force && cached && Date.now() - cached.savedAt < 15 * 60 * 1000)
    return json(200, { ...cached.data, cached: true });

  try {
    const base = process.env.INTERCOAST_BOT_API_URL;
    const token = process.env.INTERCOAST_CALENDAR_PANEL_TOKEN;
    if (!base || !token) throw new Error("La lectura privada no está configurada.");
    const target = new URL(base);
    target.searchParams.delete("key");
    target.searchParams.delete("fn");
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "panelDriveHealth", token }),
      signal: AbortSignal.timeout(26000),
    });
    const output = await response.text();
    if (/^\s*</.test(output))
      throw new Error("Google devolvió una página en vez de datos.");
    const data = JSON.parse(output);
    if (!data.ok) throw new Error(data.error || "Drive no respondió.");
    memory.set("drive", { data, savedAt: Date.now() });
    return json(200, { ...data, cached: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error("Admin drive health error", { message });
    if (cached) return json(200, { ...cached.data, cached: true, stale: true });
    return json(502, { error: "No se pudo medir Drive." });
  }
};
