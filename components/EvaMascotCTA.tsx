import React from 'react';
import { motion } from 'framer-motion';
import { WORLD_CUP_SEASON, WORLD_CUP_CONFIG } from '../constants/worldCupTheme';

export default function EvaMascotCTA() {
  const openChat = (e?: React.MouseEvent) => {
    try { e?.stopPropagation(); } catch {}
    try {
      const w = window as any;
      if (typeof w.evaOpenDock === 'function') { w.evaOpenDock(); }
      window.dispatchEvent(new CustomEvent('eva:dock:open'));
      window.dispatchEvent(new CustomEvent('eva:sound:open'));
    } catch {}
  };

  /* ── Versión normal (sin mundial) ─────────────────────────── */
  if (!WORLD_CUP_SEASON) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_10px_30px_-10px_rgb(2_6_23/0.2)]"
          style={{
            backgroundImage:
              'radial-gradient(1200px 400px at -10% -20%, rgba(56,189,248,0.12), transparent 60%),' +
              'radial-gradient(800px 300px at 110% 10%, rgba(16,185,129,0.10), transparent 60%)',
          }}
        >
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200/70 to-emerald-200/70 blur-2xl" />
          <div className="grid items-center gap-6 p-6 md:grid-cols-[minmax(280px,420px)_1fr] md:p-10">
            <div className="relative grid place-items-center pointer-events-auto">
              <button type="button" onClick={openChat} onMouseDown={openChat}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openChat(e as any); }}
                aria-label="Abrir chat con EVA"
                className="focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-2xl"
              >
                <picture>
                  <source srcSet="/eva/eva-baby-cta-1200.webp" media="(min-width: 768px)" type="image/webp" />
                  <source srcSet="/eva/eva-baby-cta-720.webp" type="image/webp" />
                  <img src="/eva/eva-baby-cta.webp" onError={(e) => (e.currentTarget.src = '/eva/EVA-baby-CTA.png')}
                    alt="EVA invita a chatear ahora"
                    className="max-h-[360px] w-auto md:max-h-[420px] drop-shadow-xl select-none"
                    width={1200} height={1200} loading="eager" draggable={false}
                  />
                </picture>
              </button>
            </div>
            <div className="relative z-10">
              <p className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
                Habla ya mismo con <span className="text-sky-600">nuestra asistente virtual</span>
              </p>
              <p className="mt-3 max-w-prose text-neutral-600">EVA te ayuda a cotizar, resolver dudas y avanzar en tu compra en minutos.</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" onClick={openChat} onMouseDown={openChat}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openChat(e as any); }}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                  aria-label="Abrir chat con EVA"
                >
                  Abrir chat con EVA
                </button>
                <span className="text-xs text-neutral-500">100% online • Respuesta en segundos</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Versión MUNDIALISTA ───────────────────────────────────── */
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #003d1a 0%, #005c28 40%, #004d22 70%, #002d12 100%)',
        }}
      >
        {/* ── Líneas de cancha ── */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Borde cancha */}
          <rect x="40" y="30" width="720" height="340" fill="none" stroke="white" strokeWidth="2"/>
          {/* Línea central */}
          <line x1="400" y1="30" x2="400" y2="370" stroke="white" strokeWidth="2"/>
          {/* Círculo central */}
          <circle cx="400" cy="200" r="70" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="400" cy="200" r="4" fill="white"/>
          {/* Área izquierda */}
          <rect x="40" y="120" width="110" height="160" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="40" y="155" width="50" height="90" fill="none" stroke="white" strokeWidth="2"/>
          {/* Área derecha */}
          <rect x="650" y="120" width="110" height="160" fill="none" stroke="white" strokeWidth="2"/>
          <rect x="710" y="155" width="50" height="90" fill="none" stroke="white" strokeWidth="2"/>
        </svg>

        {/* ── Franjas de grama ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,1) 40px, rgba(255,255,255,1) 80px)',
          }}
        />

        {/* ── Banderines ── */}
        <div aria-hidden className="absolute top-0 left-0 right-0 flex justify-center gap-0 overflow-hidden pointer-events-none">
          {['#e63946','#f4d03f','#2ecc71','#3498db','#e67e22','#9b59b6','#e63946','#f4d03f','#2ecc71','#3498db','#e67e22','#9b59b6','#e63946','#f4d03f','#2ecc71'].map((color, i) => (
            <svg key={i} width="36" height="28" viewBox="0 0 36 28">
              <polygon points="4,0 32,0 18,24" fill={color} opacity="0.9"/>
              <line x1="18" y1="0" x2="18" y2="-8" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            </svg>
          ))}
        </div>

        {/* ── Contenido ── */}
        <div className="relative z-10 grid items-center gap-0 md:grid-cols-[minmax(260px,380px)_1fr]">

          {/* Eva mundialista */}
          <div className="relative flex items-end justify-center pt-10 pb-0 px-4">
            <motion.button
              type="button"
              onClick={openChat}
              onMouseDown={openChat}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openChat(e as any); }}
              aria-label="Abrir chat con EVA"
              className="focus:outline-none group"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                src={WORLD_CUP_CONFIG.evaAssets.cta}
                alt="EVA mundialista - ¡Chatea ahora!"
                className="max-h-[340px] md:max-h-[400px] w-auto select-none drop-shadow-2xl"
                style={{ mixBlendMode: 'multiply' }}
                loading="eager"
                draggable={false}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/eva/eva-baby-cta.webp';
                  (e.currentTarget as HTMLImageElement).style.mixBlendMode = 'normal';
                }}
              />
            </motion.button>
          </div>

          {/* Texto */}
          <div className="relative z-10 p-6 md:p-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow mb-4"
            >
              🏆 Temporada Mundialista 2026
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight"
            >
              Tu cobertura también<br/>
              <span className="text-yellow-400">juega de titular</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-green-100 max-w-md"
            >
              Cotiza tu seguro de auto antes del próximo partido y maneja tranquilo con Intercoast.
            </motion.p>

            {/* Stats mundialistas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="mt-5 flex flex-wrap gap-3"
            >
              {[
                { icon: '🛡️', label: 'Defensa confiable', desc: 'Sin quedar desprotegido' },
                { icon: '⚡', label: 'Jugada rápida', desc: 'Cotiza con tu VIN en minutos' },
                { icon: '⚽', label: 'Asistencia de gol', desc: 'Eva te guía en español' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-white text-xs font-bold">{item.label}</p>
                    <p className="text-green-200 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Botones */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={openChat}
                onMouseDown={openChat}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openChat(e as any); }}
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 font-bold shadow-lg transition-all hover:scale-105"
                aria-label="Cotizar antes del pitazo inicial"
              >
                ⚽ Cotizar antes del pitazo inicial
              </button>
              <button
                type="button"
                onClick={openChat}
                onMouseDown={openChat}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openChat(e as any); }}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white px-6 py-3 font-semibold border border-white/30 transition-all"
                aria-label="Hablar con Eva"
              >
                💬 Hablar con Eva
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
