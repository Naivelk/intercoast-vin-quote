import React from 'react';
import { motion } from 'framer-motion';

// Comunidades hispanohablantes y de habla inglesa que atendemos en California
const countries = [
  { code: 'co', name: 'Colombia' },
  { code: 'pe', name: 'Perú' },
  { code: 'ec', name: 'Ecuador' },
  { code: 'ar', name: 'Argentina' },
  { code: 'mx', name: 'México' },
  { code: 'hn', name: 'Honduras' },
  { code: 'sv', name: 'El Salvador' },
  { code: 'ni', name: 'Nicaragua' },
  { code: 'us', name: 'Estados Unidos' },
];

// Duplicamos para scroll infinito
const doubled = [...countries, ...countries, ...countries];

export default function CountriesStrip() {
  return (
    <div
      className="relative overflow-hidden py-5"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brillo sutil */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(56,189,248,0.04) 0%, transparent 70%)',
        }}
      />

      <p className="relative z-10 text-center text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">
        Comunidades que atendemos
      </p>

      <div className="relative">
        {/* Fades laterales */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
          style={{ background: 'linear-gradient(to right, #0f172a, transparent)' }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
          style={{ background: 'linear-gradient(to left, #0f172a, transparent)' }}
        />

        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {doubled.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 min-w-[72px]"
            >
              <div className="w-12 h-8 rounded-lg overflow-hidden shadow-lg border border-white/15 flex-shrink-0">
                <img
                  src={`https://flagcdn.com/w40/${c.code}.png`}
                  srcSet={`https://flagcdn.com/w80/${c.code}.png 2x`}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                {c.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
