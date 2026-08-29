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

async function relay(action, payload = {}) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const relayToken = process.env.LEADS_RELAY_TOKEN;
  if (!url || !relayToken) throw new Error("El relay privado no está configurado.");
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ action, relayToken, ...payload }),
  });
  if (!response.ok) throw new Error("El historial no respondió.");
  return response.json();
}

export default async (request) => {
  const user = await getUser();
  const email = String(user?.email || "").toLowerCase();
  if (!ALLOWED_EMAILS.has(email)) return json(403, { error: "No tienes acceso al historial." });

  try {
    if (request.method === "GET") {
      const data = await relay("audit_list");
      return json(data.ok ? 200 : 502, data);
    }
    if (request.method === "POST") {
      const body = await request.json();
      const data = await relay("audit_append", {
        user: email,
        auditAction: String(body.action || "Actividad"),
        entity: String(body.entity || "Panel"),
        detail: String(body.detail || ""),
      });
      return json(data.ok ? 200 : 502, data);
    }
    return json(405, { error: "Método no permitido." });
  } catch (error) {
    console.error("Admin audit error", { message: error instanceof Error ? error.message : "unknown" });
    return json(502, { error: "No se pudo acceder al historial." });
  }
};
