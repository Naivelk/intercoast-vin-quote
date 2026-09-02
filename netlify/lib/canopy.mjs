import { createHmac, timingSafeEqual } from "node:crypto";

const CANOPY_API_BASE = "https://app.usecanopy.com/api/v1.0.0";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const CANOPY_EVENTOS = new Set([
  "AUTH_STATUS",
  "POLICIES_AVAILABLE",
  "COMPLETE",
  "ERROR",
]);

export const CANOPY_EVENTOS_CON_DATOS = new Set([
  "POLICIES_AVAILABLE",
  "COMPLETE",
]);

const texto = (value) => (value == null ? "" : String(value));
const lista = (value) => (Array.isArray(value) ? value : []);

export function parseCanopySignature(header) {
  const result = { timestamp: null, signatures: [] };
  for (const part of texto(header).split(",")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === "t" && /^\d+$/.test(value)) result.timestamp = Number(value);
    if (key === "s" && /^[0-9a-f]{64}$/i.test(value)) {
      result.signatures.push(value.toLowerCase());
    }
  }
  return result;
}

export function verifyCanopySignature({
  header,
  rawBody,
  secret,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = 300,
}) {
  const { timestamp, signatures } = parseCanopySignature(header);
  if (!secret || !Number.isSafeInteger(timestamp) || signatures.length === 0) {
    return false;
  }
  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${texto(rawBody)}`)
    .digest();

  return signatures.some((signature) => {
    const received = Buffer.from(signature, "hex");
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}

export function extractCanopyWebhook(rawBody) {
  let payload;
  try {
    payload = JSON.parse(texto(rawBody));
  } catch {
    throw new Error("CANOPY_WEBHOOK_JSON_INVALIDO");
  }

  const eventType = texto(payload?.event_type || payload?.eventType).toUpperCase();
  const pullId = texto(
    payload?.pull_id || payload?.pullId || payload?.pull?.pull_id || payload?.data?.pull_id,
  );
  const teamId = texto(payload?.team_id || payload?.teamId);

  if (!CANOPY_EVENTOS.has(eventType)) {
    throw new Error("CANOPY_EVENTO_NO_ADMITIDO");
  }
  if (!UUID_RE.test(pullId)) throw new Error("CANOPY_PULL_ID_INVALIDO");
  if (teamId && !UUID_RE.test(teamId)) throw new Error("CANOPY_TEAM_ID_INVALIDO");

  return { eventType, pullId, teamId, status: texto(payload?.status) };
}

export async function fetchCanopyPull({
  teamId,
  pullId,
  clientId,
  clientSecret,
  fetchImpl = fetch,
}) {
  if (!UUID_RE.test(texto(teamId))) throw new Error("CANOPY_TEAM_ID_INVALIDO");
  if (!UUID_RE.test(texto(pullId))) throw new Error("CANOPY_PULL_ID_INVALIDO");
  if (!clientId || !clientSecret) throw new Error("CANOPY_CREDENCIALES_FALTANTES");

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetchImpl(
    `${CANOPY_API_BASE}/teams/${encodeURIComponent(teamId)}/pulls/${encodeURIComponent(pullId)}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${credentials}`,
      },
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) throw new Error(`CANOPY_HTTP_${response.status}`);
  return response.json();
}

const cobertura = (item) => ({
  code: texto(item?.name),
  label: texto(item?.friendly_name),
  premiumCents: item?.premium_cents ?? null,
  perPersonLimitCents: item?.per_person_limit_cents ?? null,
  perIncidentLimitCents: item?.per_incident_limit_cents ?? null,
  deductibleCents: item?.deductible_cents ?? null,
  declined: Boolean(item?.is_declined),
});

const vehiculo = (item) => ({
  vehicleId: texto(item?.vehicle_id),
  vin: texto(item?.vin),
  year: item?.year ?? null,
  make: texto(item?.make),
  model: texto(item?.model),
  series: texto(item?.series),
  type: texto(item?.type),
  coverages: lista(item?.coverages).map(cobertura),
});

export function normalizeCanopyPull(response) {
  const pull = response?.pull || response;
  if (!pull || typeof pull !== "object") throw new Error("CANOPY_PULL_INVALIDO");

  const policies = lista(pull.policies).map((policy) => ({
    policyId: texto(policy?.policy_id),
    policyNumber: texto(policy?.carrier_policy_number),
    policyType: texto(policy?.policy_type),
    carrier: texto(policy?.carrier_friendly_name || policy?.carrier_name),
    status: texto(policy?.status),
    effectiveDate: texto(policy?.effective_date),
    expiryDate: texto(policy?.expiry_date),
    renewalDate: texto(policy?.renewal_date),
    totalPremiumCents: policy?.total_premium_cents ?? null,
    vehicles: lista(policy?.vehicles).map(vehiculo),
    driverCount: lista(policy?.drivers).length,
  }));

  return {
    contract: "intercoast.canopy-pull",
    version: 1,
    source: "Canopy Connect",
    pullId: texto(pull.pull_id),
    status: texto(pull.status),
    provider: texto(
      pull.insurance_provider_friendly_name || pull.insurance_provider_name,
    ),
    createdAt: texto(pull.created_at),
    policies,
    documents: lista(pull.documents).map((document) => ({
      documentId: texto(document?.document_id),
      policyId: texto(document?.policy_id),
      type: texto(document?.document_type),
      title: texto(document?.title),
    })),
  };
}

export function summarizeCanopyContract(contract) {
  const policies = lista(contract?.policies);
  return {
    policies: policies.length,
    vehicles: policies.reduce((total, policy) => total + lista(policy.vehicles).length, 0),
    drivers: policies.reduce((total, policy) => total + Number(policy.driverCount || 0), 0),
    coverages: policies.reduce(
      (total, policy) =>
        total +
        lista(policy.vehicles).reduce(
          (vehicleTotal, vehicle) => vehicleTotal + lista(vehicle.coverages).length,
          0,
        ),
      0,
    ),
    documents: lista(contract?.documents).length,
  };
}
