import { getUser } from "@netlify/identity";

const ALLOWED_EMAILS = new Set(["intercoast.texto@gmail.com", "alequito09@hotmail.com"]);
const SAFE_DIAGNOSTICS = new Set([
  "estadoHojaDatos",
  "medirRenovaciones",
  "medirRiesgo",
  "medirRenovacionEnRiesgo",
  "medirCallbright",
  "detectarAnomalias",
  "listaRecuperables",
  "medirCruce",
]);
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store, private" } });

export default async (request) => {
  const user = await getUser();
  const email = String(user?.email || "").toLowerCase();
  if (!ALLOWED_EMAILS.has(email)) return json(403, { error: "No tienes acceso a diagnósticos." });
  const fn = new URL(request.url).searchParams.get("fn") || "";
  if (!SAFE_DIAGNOSTICS.has(fn)) return json(400, { error: "Diagnóstico no permitido." });
  try {
    const base = process.env.INTERCOAST_BOT_API_URL;
    if (!base) throw new Error("La API de diagnóstico no está configurada.");
    const target = new URL(base);
    target.searchParams.set("fn", fn);
    const response = await fetch(target, { signal: AbortSignal.timeout(55000) });
    const output = await response.text();
    if (!response.ok || output.startsWith("ERROR:") || output.startsWith("EXCEPCIÓN")) {
      throw new Error(output.slice(0, 500) || "La automatización no respondió.");
    }
    return json(200, { ok: true, fn, output: output.slice(0, 100000), ranAt: new Date().toISOString() });
  } catch (error) {
    console.error("Admin diagnostic error", { fn, message: error instanceof Error ? error.message : "unknown" });
    return json(502, { error: error instanceof Error ? error.message : "No se pudo ejecutar el diagnóstico." });
  }
};
