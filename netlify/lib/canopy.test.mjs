import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  extractCanopyWebhook,
  fetchCanopyPull,
  normalizeCanopyPull,
  parseCanopySignature,
  summarizeCanopyContract,
  verifyCanopySignature,
} from "./canopy.mjs";

const TEAM_ID = "11111111-1111-4111-8111-111111111111";
const PULL_ID = "22222222-2222-4222-8222-222222222222";
const SECRET = "secreto-sintetico";
const NOW = 1_700_000_000;
const body = JSON.stringify({
  team_id: TEAM_ID,
  pull_id: PULL_ID,
  event_type: "COMPLETE",
  status: "SUCCESS",
});

const signature = (payload = body, timestamp = NOW) =>
  createHmac("sha256", SECRET)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

test("interpreta una cabecera con varias firmas", () => {
  const parsed = parseCanopySignature(`t=${NOW},s=${"0".repeat(64)},s=${signature()}`);
  assert.equal(parsed.timestamp, NOW);
  assert.equal(parsed.signatures.length, 2);
});

test("acepta la firma exacta dentro de la tolerancia", () => {
  assert.equal(
    verifyCanopySignature({
      header: `t=${NOW},s=${signature()}`,
      rawBody: body,
      secret: SECRET,
      nowSeconds: NOW + 120,
    }),
    true,
  );
});

test("rechaza firma alterada, evento viejo y evento futuro", () => {
  assert.equal(
    verifyCanopySignature({
      header: `t=${NOW},s=${signature()}`,
      rawBody: `${body} `,
      secret: SECRET,
      nowSeconds: NOW,
    }),
    false,
  );
  assert.equal(
    verifyCanopySignature({
      header: `t=${NOW},s=${signature()}`,
      rawBody: body,
      secret: SECRET,
      nowSeconds: NOW + 301,
    }),
    false,
  );
  assert.equal(
    verifyCanopySignature({
      header: `t=${NOW},s=${signature()}`,
      rawBody: body,
      secret: SECRET,
      nowSeconds: NOW - 301,
    }),
    false,
  );
});

test("extrae solo el sobre mínimo del webhook", () => {
  assert.deepEqual(extractCanopyWebhook(body), {
    eventType: "COMPLETE",
    pullId: PULL_ID,
    teamId: TEAM_ID,
    status: "SUCCESS",
  });
  assert.throws(
    () => extractCanopyWebhook(JSON.stringify({ event_type: "OTRO", pull_id: PULL_ID })),
    /CANOPY_EVENTO_NO_ADMITIDO/,
  );
});

test("consulta el pull con Basic Auth sin exponer credenciales en la URL", async () => {
  let captured;
  const result = await fetchCanopyPull({
    teamId: TEAM_ID,
    pullId: PULL_ID,
    clientId: "cliente",
    clientSecret: "clave",
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return { ok: true, json: async () => ({ pull: { pull_id: PULL_ID } }) };
    },
  });
  assert.equal(result.pull.pull_id, PULL_ID);
  assert.match(captured.url, new RegExp(`/teams/${TEAM_ID}/pulls/${PULL_ID}$`));
  assert.equal(captured.url.includes("cliente"), false);
  assert.equal(
    captured.options.headers.Authorization,
    `Basic ${Buffer.from("cliente:clave").toString("base64")}`,
  );
});

test("normaliza una respuesta sintética y resume sin devolver personas", () => {
  const contract = normalizeCanopyPull({
    success: true,
    pull: {
      pull_id: PULL_ID,
      status: "SUCCESS",
      first_name: "PERSONA FICTICIA",
      mobile_phone: "5555550100",
      insurance_provider_friendly_name: "Carrier de prueba",
      policies: [
        {
          policy_id: "33333333-3333-4333-8333-333333333333",
          carrier_policy_number: "POLIZA-FICTICIA",
          policy_type: "AUTO",
          status: "ACTIVE",
          drivers: [{ first_name: "CONDUCTOR FICTICIO" }],
          vehicles: [
            {
              vehicle_id: "44444444-4444-4444-8444-444444444444",
              vin: "1M8GDM9AXKP042788",
              year: 2020,
              make: "MARCA",
              model: "MODELO",
              coverages: [{ name: "COLLISION", deductible_cents: 50000 }],
            },
          ],
        },
      ],
      documents: [{ document_id: "55555555-5555-4555-8555-555555555555", document_type: "DECLARATIONS" }],
    },
  });

  assert.equal(contract.contract, "intercoast.canopy-pull");
  assert.equal(contract.policies[0].driverCount, 1);
  assert.equal(JSON.stringify(contract).includes("PERSONA FICTICIA"), false);
  assert.equal(JSON.stringify(contract).includes("5555550100"), false);
  assert.deepEqual(summarizeCanopyContract(contract), {
    policies: 1,
    vehicles: 1,
    drivers: 1,
    coverages: 1,
    documents: 1,
  });
});
