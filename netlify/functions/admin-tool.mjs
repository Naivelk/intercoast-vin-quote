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

/* ═══ EL CACHÉ QUE SOBREVIVE A LA INSTANCIA ══════════════════════════════════
 *
 * `memory` vive en el `globalThis` de **esta** instancia de la función. Un
 * arranque en frío lo pierde, así que el primero que abre el panel por la
 * mañana paga la llamada entera al bot: medido, `cargarResumen` son ~4 s y
 * `listaDelDia` ~2,5 s.
 *
 * Con un almacén persistente eso también sale del caché. Pero aquí cuelga el
 * puente del que vive TODO el panel, así que:
 *
 *   ⚠️ **Si Blobs falla por lo que sea, esto se comporta exactamente como
 *   antes.** El import es dinámico, cada lectura y cada escritura van en su
 *   `try`, y ningún fallo se propaga. El peor caso posible es no mejorar.
 *
 * Nunca sustituye a `memory`: se usan los dos. La memoria es más rápida cuando
 * la instancia está caliente; el almacén es el que salva el arranque en frío.
 * ═══════════════════════════════════════════════════════════════════════════ */
let almacenPromesa;
async function almacen() {
  if (almacenPromesa === undefined) {
    almacenPromesa = (async () => {
      try {
        const { getStore } = await import("@netlify/blobs");
        return getStore("intercoast-panel");
      } catch {
        return null;
      }
    })();
  }
  return almacenPromesa;
}

async function leerDelAlmacen(clave) {
  try {
    const s = await almacen();
    if (!s) return null;
    const crudo = await s.get(clave, { type: "json" });
    return crudo && typeof crudo.savedAt === "number" ? crudo : null;
  } catch {
    return null;
  }
}

async function guardarEnAlmacen(clave, data, savedAt) {
  try {
    const s = await almacen();
    if (!s) return;
    await s.setJSON(clave, { data, savedAt });
  } catch {
    /* En silencio: el caché es una mejora, no un requisito. */
  }
}
const CACHE_TTL = {
  "consola:cargarResumen": 10 * 60 * 1000,
  "consola:listaDelDia": 3 * 60 * 1000,
  "consola:dineroDelDia": 3 * 60 * 1000,
  "consola:inventarioCorreo": 10 * 60 * 1000,
  "consola:centroControl": 5 * 1000,
  "consola:resumenAsistencia": 15 * 1000,
  // La pestaña la publica el bot y no se mueve sola: no hace falta
  // preguntarla cada vez. Diez minutos, como las demás lecturas quietas.
  "consola:operacionPorOficina": 10 * 60 * 1000,
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
          "operacionPorOficina",
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

      /* La instancia está fría o el dato caducó en memoria: puede que otra
       * instancia ya lo haya pedido hace poco. Se mira el almacén antes de
       * molestar al bot, y se recalienta la memoria con lo que traiga. */
      if (!body.force && ttl) {
        const guardado = await leerDelAlmacen(cacheKey);
        if (guardado && Date.now() - guardado.savedAt < ttl) {
          memory.set(cacheKey, guardado);
          return json(200, { ...guardado.data, cached: true });
        }
      }

      /* El reloj de asistencia de la página de Zelle pide identificarse y
       * tener la jornada abierta: es un control para los seis agentes. El
       * manager no ficha, así que su panel se quedaba en «Identificación
       * requerida» viendo cero pagos.
       *
       * Quien demuestra aquí quién llama es esta misma función, arriba: el
       * correo contra `ALLOWED_EMAILS`. Este token solo transporta esa prueba
       * hasta Apps Script, que no puede ver la sesión de Netlify. Va en el
       * cuerpo y NO en la URL, y nunca sale de esta función — el navegador no
       * lo ve. Sin la variable de entorno no se manda nada y el reloj sigue
       * pidiendo identificación como antes. */
      const cuerpo = { action, args: JSON.stringify(args) };
      if (tool === "zelle" && process.env.INTERCOAST_ZELLE_PANEL_TOKEN) {
        cuerpo.panel = process.env.INTERCOAST_ZELLE_PANEL_TOKEN;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(cuerpo),
      });
      const data = await response.json();
      if (data.ok && ttl) {
        const savedAt = Date.now();
        memory.set(cacheKey, { data, savedAt });
        /* Sin `await`: guardar es una cortesía para la próxima instancia, no
         * algo que deba hacer esperar a quien ya tiene su respuesta. */
        void guardarEnAlmacen(cacheKey, data, savedAt);
      }
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
