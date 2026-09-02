import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import handler from "../functions/canopy-webhook.mjs";

const TEAM_ID = "11111111-1111-4111-8111-111111111111";
const PULL_ID = "22222222-2222-4222-8222-222222222222";
const SECRET = "secreto-sintetico";

const withEnv = async (values, callback) => {
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, values);
  try {
    return await callback();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value == null) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

const signedRequest = (payload) => {
  const rawBody = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", SECRET)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  return new Request("https://example.test/api/integrations/canopy/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "canopy-signature": `t=${timestamp},s=${signature}`,
    },
    body: rawBody,
  });
};

test("falla cerrada cuando el POC está apagado", async () => {
  await withEnv({ CANOPY_POC_ENABLED: "false" }, async () => {
    const response = await handler(new Request("https://example.test", { method: "POST" }));
    assert.equal(response.status, 404);
  });
});

test("procesa COMPLETE y responde solo con agregados", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      pull: {
        pull_id: PULL_ID,
        status: "SUCCESS",
        first_name: "PERSONA FICTICIA",
        mobile_phone: "5555550100",
        policies: [
          {
            carrier_policy_number: "POLIZA-FICTICIA",
            drivers: [{ first_name: "CONDUCTOR FICTICIO" }],
            vehicles: [{ vin: "1M8GDM9AXKP042788", coverages: [{ name: "COLLISION" }] }],
          },
        ],
        documents: [{ document_id: "55555555-5555-4555-8555-555555555555" }],
      },
    }),
  });

  try {
    await withEnv(
      {
        CANOPY_POC_ENABLED: "true",
        CANOPY_TEAM_ID: TEAM_ID,
        CANOPY_CLIENT_ID: "cliente",
        CANOPY_CLIENT_SECRET: "clave",
        CANOPY_WEBHOOK_SECRET: SECRET,
      },
      async () => {
        const response = await handler(
          signedRequest({
            team_id: TEAM_ID,
            pull_id: PULL_ID,
            event_type: "COMPLETE",
            status: "SUCCESS",
          }),
        );
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.deepEqual(body, {
          ok: true,
          received: true,
          fetched: true,
          contractVersion: 1,
          counts: { policies: 1, vehicles: 1, drivers: 1, coverages: 1, documents: 1 },
        });
        assert.equal(JSON.stringify(body).includes("POLIZA-FICTICIA"), false);
        assert.equal(JSON.stringify(body).includes(PULL_ID), false);
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
