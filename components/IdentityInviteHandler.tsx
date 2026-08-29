import React, { useEffect, useState } from 'react';
import { acceptInvite, handleAuthCallback } from '@netlify/identity';

const AUTH_HASH_PATTERN = /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/;

/**
 * Netlify sends Identity email links to the site's root URL. This component
 * must therefore live above the router so invite tokens are never lost on
 * the public landing page.
 */
export default function IdentityInviteHandler({ children }: { children: React.ReactNode }) {
  const [processing, setProcessing] = useState(() => AUTH_HASH_PATTERN.test(window.location.hash));
  const [inviteToken, setInviteToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!AUTH_HASH_PATTERN.test(window.location.hash)) return;

    handleAuthCallback()
      .then((result) => {
        if (result?.type === 'invite' && result.token) {
          setInviteToken(result.token);
          setProcessing(false);
          return;
        }
        if (result) window.location.replace('/admin');
        else setProcessing(false);
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : 'No se pudo procesar el enlace de acceso.');
        setProcessing(false);
      });
  }, []);

  const submitInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      await acceptInvite(inviteToken, password);
      window.location.replace('/admin');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo crear la contraseña.');
    }
  };

  if (processing) return <main className="grid min-h-screen place-items-center bg-slate-100 p-6 text-slate-800"><p className="rounded-xl bg-white px-6 py-4 font-semibold shadow">Verificando tu invitación…</p></main>;

  if (inviteToken) return <main className="grid min-h-screen place-items-center bg-slate-100 p-4 text-slate-900">
    <form onSubmit={submitInvite} className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Intercoast Insurance</p>
      <h1 className="mt-2 text-3xl font-extrabold">Crea tu contraseña</h1>
      <p className="mt-2 text-sm text-slate-600">Tu invitación fue validada. Esta contraseña te dará acceso al panel de leads.</p>
      <label className="mt-6 block text-sm font-semibold">Contraseña nueva
        <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus />
      </label>
      {message && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{message}</p>}
      <button className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800">Activar mi acceso</button>
    </form>
  </main>;

  if (message) return <main className="grid min-h-screen place-items-center bg-slate-100 p-6 text-slate-800"><div className="max-w-md rounded-xl bg-white p-6 shadow"><p>{message}</p><a className="mt-4 inline-block font-bold text-blue-700" href="/admin">Ir al panel</a></div></main>;

  return <>{children}</>;
}
