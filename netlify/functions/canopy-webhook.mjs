import {
  CANOPY_EVENTOS_CON_DATOS,
  extractCanopyWebhook,
  fetchCanopyPull,
  normalizeCanopyPull,
  summarizeCanopyContract,
  verifyCanopySignature,
} from "../lib/canopy.mjs";

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
  if (process.env.CANOPY_POC_ENABLED !== "true") {
    return json(404, { error: "Integración no disponible." });
  }
  if (request.method !== "POST") {
    return json(405, { error: "Método no permitido." });
  }

  const webhookSecret = process.env.CANOPY_WEBHOOK_SECRET || "";
  const teamId = process.env.CANOPY_TEAM_ID || "";
  const clientId = process.env.CANOPY_CLIENT_ID || "";
  const clientSecret = process.env.CANOPY_CLIENT_SECRET || "";
  if (!webhookSecret || !teamId || !clientId || !clientSecret) {
    return json(503, { error: "Integración no configurada." });
  }

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > 1_000_000) {
      return json(413, { error: "Evento demasiado grande." });
    }
    if (
      !verifyCanopySignature({
        header: request.headers.get("canopy-signature"),
        rawBody,
        secret: webhookSecret,
      })
    ) {
      return json(401, { error: "Firma inválida." });
    }

    const event = extractCanopyWebhook(rawBody);
    if (event.teamId && event.teamId.toLowerCase() !== teamId.toLowerCase()) {
      return json(403, { error: "Equipo no autorizado." });
    }
    if (!CANOPY_EVENTOS_CON_DATOS.has(event.eventType)) {
      return json(200, { ok: true, received: true, fetched: false });
    }

    const pull = await fetchCanopyPull({
      teamId,
      pullId: event.pullId,
      clientId,
      clientSecret,
    });
    const contract = normalizeCanopyPull(pull);

    // El POC no persiste ni devuelve datos de póliza. Solo prueba el contrato.
    return json(200, {
      ok: true,
      received: true,
      fetched: true,
      contractVersion: contract.version,
      counts: summarizeCanopyContract(contract),
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "CANOPY_ERROR_DESCONOCIDO";
    // No registrar cuerpos, IDs, pólizas, VIN, nombres ni documentos.
    console.error("Canopy POC failed", { code: /^CANOPY_[A-Z0-9_]+$/.test(code) ? code : "CANOPY_ERROR" });
    return json(400, { error: "No se pudo procesar el evento." });
  }
};
