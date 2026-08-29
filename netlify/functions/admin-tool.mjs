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
      "Cache-Control": "no-store, private",
    },
  });

const memory = globalThis.__intercoastToolCache || new Map();
globalThis.__intercoastToolCache = memory;
const CACHE_TTL = {
  "consola:cargarResumen": 10 * 60 * 1000,
  "consola:listaDelDia": 3 * 60 * 1000,
  "consola:dineroDelDia": 3 * 60 * 1000,
  "consola:inventarioCorreo": 10 * 60 * 1000,
  "consola:centroControl": 5 * 1000,
  "consola:resumenAsistencia": 15 * 1000,
  "zelle:datos": 2 * 60 * 1000,
};

export default async (request) => {
  const user = await getUser();
  const email = String(user?.email || "").toLowerCase();
  if (!ALLOWED_EMAILS.has(email)) {
    return json(403, { error: "No tienes acceso a esta herramienta." });
  }

  const tool = new URL(request.url).searchParams.get("tool");
  const urls = {
    consola: process.env.INTERCOAST_CONSOLE_URL,
    zelle: process.env.INTERCOAST_ZELLE_URL,
  };
  const url = urls[tool];
  if (!url) return json(404, { error: "La herramienta no está configurada." });

  if (request.method === "POST") {
    try {
      const body = await request.json();
      const allowed = {
        consola: new Set([
          "cargarResumen",
          "listaDelDia",
          "dineroDelDia",
          "inventarioCorreo",
          "buscar",
          "centroControl",
          "resumenAsistencia",
          "solicitarControl",
        ]),
        zelle: new Set(["datos", "actualizar"]),
      };
      const action = String(body.action || "");
      if (!allowed[tool]?.has(action)) {
        return json(400, { error: "Acción no permitida." });
      }

      const args = Array.isArray(body.args) ? body.args : [];
      const cacheKey = `${tool}:${action}:${JSON.stringify(args)}`;
      const ttl = CACHE_TTL[`${tool}:${action}`] || 0;
      const cached = memory.get(cacheKey);
      if (!body.force && ttl && cached && Date.now() - cached.savedAt < ttl) {
        return json(200, { ...cached.data, cached: true });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action,
          args: JSON.stringify(args),
        }),
      });
      const data = await response.json();
      if (data.ok && ttl) memory.set(cacheKey, { data, savedAt: Date.now() });
      return json(data.ok ? 200 : 502, { ...data, cached: false });
    } catch (error) {
      console.error("Admin tool call failed", {
        tool,
        message: error instanceof Error ? error.message : "unknown",
      });
      return json(502, { error: "La herramienta no respondió." });
    }
  }

  return json(200, { ok: true, url });
};
