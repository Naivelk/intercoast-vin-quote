import { getUser } from '@netlify/identity';

const ALLOWED_EMAILS = new Set([
  'intercoast.texto@gmail.com',
  'alequito09@hotmail.com',
]);

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

async function callLeadService(action, payload = {}) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const relayToken = process.env.LEADS_RELAY_TOKEN;
  if (!url || !relayToken) throw new Error('El relay de leads no está configurado.');

  const body = new URLSearchParams({ action, relayToken, ...payload });
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) throw new Error('No se pudo conectar con el servicio de leads.');
  return response.json();
}

export default async (request) => {
  const user = await getUser();
  const email = String(user?.email || '').toLowerCase();
  if (!ALLOWED_EMAILS.has(email)) return json(403, { error: 'No tienes acceso a este panel.' });

  try {
    // Initializes the private Apps Script bridge on the first authenticated use.
    await callLeadService('bootstrap');

    if (request.method === 'GET') {
      const data = await callLeadService('admin_list');
      return json(data.ok ? 200 : 502, data);
    }

    if (request.method === 'PUT') {
      const body = await request.json();
      const data = await callLeadService('admin_update', {
        row: String(body.row || ''),
        estado: String(body.estado || ''),
        asesor: String(body.asesor || ''),
        notas: String(body.notas || ''),
        proximoSeguimiento: String(body.proximoSeguimiento || ''),
      });
      return json(data.ok ? 200 : 400, data);
    }

    return json(405, { error: 'Método no permitido.' });
  } catch (error) {
    console.error('Admin leads error', { message: error instanceof Error ? error.message : 'unknown' });
    return json(502, { error: 'No se pudieron cargar los leads.' });
  }
};
