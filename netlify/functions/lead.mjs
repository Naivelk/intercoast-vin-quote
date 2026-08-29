const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestBuckets = new Map();

function json(statusCode, body) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = (requestBuckets.get(ip) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  bucket.push(now);
  requestBuckets.set(ip, bucket);
  return bucket.length > MAX_REQUESTS_PER_WINDOW;
}

const text = (value, max = 300) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });
  const ip = request.headers.get('x-nf-client-connection-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) return json(429, { error: 'Demasiados intentos. Intenta más tarde.' });

  try {
    const isFormSubmission = request.headers.get('content-type')?.includes('multipart/form-data');
    const formData = isFormSubmission ? await request.formData() : null;
    const body = formData ? Object.fromEntries(formData.entries()) : await request.json();
    // Bots tend to complete hidden fields; real users never fill this one.
    if (text(body.website, 100)) return json(202, { ok: true });

    const receivedAt = new Date();
    const nextFollowUpAt = new Date(receivedAt.getTime() + 2 * 60 * 60 * 1000).toISOString();
    const lead = {
      nombre: text(body.nombre, 100), nacimiento: text(body.nacimiento, 20), documento: text(body.documento, 80),
      direccion: text(body.direccion, 250), email: text(body.email, 254).toLowerCase(), telefono: text(body.telefono, 40),
      cantidadVehiculos: Math.min(Math.max(Number(body.cantidadVehiculos) || 1, 1), 5),
      totalEstimado: Number.isFinite(Number(body.totalEstimado)) ? Number(body.totalEstimado) : 0,
      idempotencyKey: text(body.idempotencyKey, 100), timestamp: receivedAt.toISOString(),
      estado: 'Nuevo', fuente: text(body.fuente, 100) || 'Sitio web',
      utmSource: text(body.utmSource, 100), utmCampaign: text(body.utmCampaign, 100),
      proximoSeguimiento: nextFollowUpAt,
    };
    if (!lead.nombre || !emailIsValid(lead.email) || !lead.telefono) return json(400, { error: 'Datos de contacto inválidos' });

    const legacyVehicles = Array.from({ length: 5 }, (_, index) => {
      const raw = body[`vehiculo${index}`];
      try { return raw ? JSON.parse(raw) : null; } catch { return null; }
    }).filter(Boolean);
    const vehicles = (Array.isArray(body.vehiculos) ? body.vehiculos : legacyVehicles).slice(0, 5).map((vehicle) => ({
      vin: text(vehicle?.vin, 17).toUpperCase(), year: text(String(vehicle?.year || ''), 4), make: text(vehicle?.make, 80),
      model: text(vehicle?.model, 100), bodyClass: text(vehicle?.bodyClass, 100), estimated: Number(vehicle?.estimated) || 0,
    }));
    if (!vehicles.length) return json(400, { error: 'Agrega al menos un vehículo' });
    if (!process.env.GOOGLE_APPS_SCRIPT_URL || !process.env.LEADS_RELAY_TOKEN) return json(503, { error: 'El envío no está configurado' });

    const form = new URLSearchParams({ ...lead, relayToken: process.env.LEADS_RELAY_TOKEN });
    vehicles.forEach((vehicle, index) => form.append(`vehiculo${index}`, JSON.stringify(vehicle)));
    const relay = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form,
    });
    if (!relay.ok) {
      console.error(`Lead relay failed with status ${relay.status}`);
      return json(502, { error: 'No se pudo guardar la cotización' });
    }
    return json(200, { ok: true });
  } catch (error) {
    console.error('Lead function error', { message: error instanceof Error ? error.message : 'unknown' });
    return json(500, { error: 'No se pudo procesar la cotización' });
  }
};
