import React from 'react';
import { motion } from 'framer-motion';

export default function WorldCupPromo() {
  const openChat = () => {
    try {
      window.dispatchEvent(new CustomEvent('eva:dock:open'));
      window.dispatchEvent(new CustomEvent('eva:sound:open'));
    } catch {}
  };

  const scrollToQuote = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-4"
    >
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #7c2d00 0%, #b94500 40%, #e05c00 60%, #b94500 80%, #7c2d00 100%)',
        }}
      >
        {/* Brillo animado */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.12) 50%, transparent 80%)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
        />

        {/* Patrón hexagonal sutil */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='48'%3E%3Cpolygon points='28,2 54,14 54,34 28,46 2,34 2,14' fill='none' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
          {/* Texto */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-xs font-extrabold px-3 py-1 rounded-full mb-3">
              🔥 OFERTA TEMPORADA MUNDIALISTA
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              ¡Asegura tu auto y<br/>
              <span className="text-yellow-300">gana como en el mundial!</span>
            </h3>
            <p className="mt-2 text-orange-100 text-sm max-w-md">
              Durante la temporada mundialista obtén orientación personalizada de nuestro equipo.
              Cotiza hoy y lleva tu tranquilidad al máximo nivel. 🏆
            </p>

            {/* Beneficios */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {[
                '✅ Cotización gratis en minutos',
                '✅ Sin importar tu historial',
                '✅ Atención 100% en español',
                '✅ Mejor precio garantizado',
              ].map((b) => (
                <span key={b} className="text-xs text-orange-50 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            {/* Balón decorativo */}
            <motion.div
              className="text-6xl drop-shadow-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              ⚽
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToQuote}
              className="w-full md:w-auto px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold rounded-full text-base shadow-2xl transition-colors"
            >
              ¡Cotizar Ahora! 🏆
            </motion.button>
            <button
              onClick={openChat}
              className="text-xs text-orange-200 hover:text-white underline underline-offset-2 transition-colors"
            >
              Hablar con Eva primero
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
