import React from 'react';
import { motion } from 'framer-motion';

/** Decoraciones del Hero en temporada mundialista */
export default function WorldCupHeroDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0">

      {/* ── Grama inferior ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: 'linear-gradient(to top, rgba(0,30,0,0.3) 0%, transparent 100%)',
        }}
      />

      {/* ── Franjas de cancha verticales ── */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.8) 80px, rgba(255,255,255,0.8) 82px)',
        }}
      />

      {/* ── Arco de portería derecha ── */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 hidden md:block"
        width="80" height="160" viewBox="0 0 80 160"
      >
        <rect x="5" y="5" width="70" height="150" fill="none" stroke="white" strokeWidth="4" rx="2"/>
        <line x1="5" y1="5" x2="5" y2="155" stroke="white" strokeWidth="4"/>
      </svg>

      {/* ── Arco de portería izquierda ── */}
      <svg
        className="absolute left-0 top-1/2 -translate-y-1/2 opacity-10 hidden md:block"
        width="80" height="160" viewBox="0 0 80 160"
      >
        <rect x="5" y="5" width="70" height="150" fill="none" stroke="white" strokeWidth="4" rx="2"/>
        <line x1="75" y1="5" x2="75" y2="155" stroke="white" strokeWidth="4"/>
      </svg>

      {/* ── Semicírculo central ── */}
      <svg
        className="absolute left-1/2 bottom-0 -translate-x-1/2 opacity-[0.08]"
        width="300" height="150" viewBox="0 0 300 150"
      >
        <path d="M0,150 A150,150 0 0,1 300,150" fill="none" stroke="white" strokeWidth="2"/>
      </svg>

      {/* ── Balones flotantes animados ── */}
      {[
        { size: 44, x: '6%',  y: '18%', delay: 0,   dur: 5.5 },
        { size: 28, x: '90%', y: '22%', delay: 1,   dur: 7   },
        { size: 20, x: '82%', y: '65%', delay: 0.4, dur: 4.8 },
        { size: 36, x: '12%', y: '60%', delay: 1.8, dur: 6.5 },
        { size: 18, x: '55%', y: '8%',  delay: 0.7, dur: 5   },
      ].map((b, i) => (
        <motion.span
          key={i}
          className="absolute select-none text-white/30"
          style={{ left: b.x, top: b.y, fontSize: b.size }}
          animate={{ y: [0, -16, 0], rotate: [0, 25, -25, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⚽
        </motion.span>
      ))}

      {/* ── Confeti de colores ── */}
      {[
        { color: '#FFD700', x: '20%', delay: 0 },
        { color: '#e63946', x: '35%', delay: 0.3 },
        { color: '#4CAF50', x: '60%', delay: 0.6 },
        { color: '#2196F3', x: '75%', delay: 0.9 },
        { color: '#FF9800', x: '85%', delay: 0.2 },
        { color: '#9C27B0', x: '10%', delay: 0.5 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-4 rounded-sm opacity-50"
          style={{ background: c.color, left: c.x, top: '-10px' }}
          animate={{ y: ['0vh', '110vh'], rotate: [0, 360, 720], opacity: [0.6, 0.4, 0] }}
          transition={{ duration: 4 + i * 0.5, delay: c.delay + i * 0.8, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* ── Badge Copa del Mundo ── */}
      <motion.div
        className="absolute top-3 right-14 md:top-5 md:right-6 flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-xl"
        initial={{ opacity: 0, scale: 0.7, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
      >
        🏆 World Cup 2026
      </motion.div>

      {/* ── Luces de estadio (esquinas) ── */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-20"
        style={{ background: 'radial-gradient(circle at top left, rgba(255,255,180,0.6), transparent 70%)' }} />
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20"
        style={{ background: 'radial-gradient(circle at top right, rgba(255,255,180,0.6), transparent 70%)' }} />
    </div>
  );
}
