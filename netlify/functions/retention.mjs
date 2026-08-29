import { getUser } from '@netlify/identity';

const ALLOWED_EMAILS = new Set(['intercoast.texto@gmail.com', 'alequito09@hotmail.com']);

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export default async () => {
  const user = await getUser();
  const email = String(user?.email || '').toLowerCase();
  if (!ALLOWED_EMAILS.has(email)) return json(403, { error: 'No tienes acceso a operaciones.' });

  try {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    const relayToken = process.env.LEADS_RELAY_TOKEN;
    if (!url || !relayToken) throw new Error('El relay privado no está configurado.');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'retention_snapshot', relayToken }),
    });
    const data = await response.json();
    return json(data.ok ? 200 : 502, data);
  } catch (error) {
    console.error('Retention snapshot error', { message: error instanceof Error ? error.message : 'unknown' });
    return json(502, { error: 'No se pudo cargar la operación de retención.' });
  }
};
