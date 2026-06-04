import React from 'react';
import { motion } from 'framer-motion';

interface Ball {
  size: number;
  x: string;
  y: string;
  delay: number;
  dur: number;
  opacity: number;
}

interface Props {
  /** 'light' = pocos balones, 'medium' = normal, 'heavy' = muchos */
  density?: 'light' | 'medium' | 'heavy';
  /** Si true muestra también elementos extra: líneas de campo, confeti, etc. */
  extras?: boolean;
}

const BALLS: Record<Props['density'] & string, Ball[]> = {
  light: [
    { size: 70,  x: '2%',  y: '15%', delay: 0,    dur: 6,   opacity: 0.13 },
    { size: 44,  x: '92%', y: '20%', delay: 1.2,  dur: 7.5, opacity: 0.10 },
    { size: 36,  x: '88%', y: '70%', delay: 0.6,  dur: 5.5, opacity: 0.09 },
  ],
  medium: [
    { size: 80,  x: '1%',  y: '10%', delay: 0,    dur: 6,   opacity: 0.13 },
    { size: 52,  x: '4%',  y: '60%', delay: 1.5,  dur: 7.5, opacity: 0.10 },
    { size: 38,  x: '2%',  y: '85%', delay: 0.7,  dur: 5.5, opacity: 0.09 },
    { size: 90,  x: '93%', y: '8%',  delay: 0.5,  dur: 8,   opacity: 0.13 },
    { size: 58,  x: '95%', y: '50%', delay: 1.2,  dur: 6.5, opacity: 0.10 },
    { size: 32,  x: '91%', y: '80%', delay: 0.3,  dur: 5,   opacity: 0.08 },
    { size: 28,  x: '48%', y: '2%',  delay: 1,    dur: 7,   opacity: 0.06 },
  ],
  heavy: [
    { size: 100, x: '0%',  y: '5%',  delay: 0,    dur: 6,   opacity: 0.14 },
    { size: 64,  x: '3%',  y: '40%', delay: 1,    dur: 7,   opacity: 0.11 },
    { size: 48,  x: '5%',  y: '70%', delay: 0.5,  dur: 5.5, opacity: 0.10 },
    { size: 30,  x: '2%',  y: '90%', delay: 1.8,  dur: 6,   opacity: 0.08 },
    { size: 110, x: '92%', y: '3%',  delay: 0.3,  dur: 8,   opacity: 0.14 },
    { size: 70,  x: '94%', y: '35%', delay: 1.3,  dur: 6.5, opacity: 0.11 },
    { size: 50,  x: '93%', y: '65%', delay: 0.8,  dur: 5,   opacity: 0.10 },
    { size: 28,  x: '91%', y: '88%', delay: 0.4,  dur: 7,   opacity: 0.08 },
    { size: 40,  x: '46%', y: '1%',  delay: 0.9,  dur: 6.5, opacity: 0.07 },
    { size: 35,  x: '20%', y: '95%', delay: 1.5,  dur: 7.5, opacity: 0.07 },
    { size: 42,  x: '75%', y: '93%', delay: 0.6,  dur: 6,   opacity: 0.07 },
  ],
};

export default function WorldCupSectionDecor({ density = 'medium', extras = false }: Props) {
  const balls = BALLS[density];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
      {/* Balones flotantes */}
      {balls.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: b.x, top: b.y, fontSize: b.size, opacity: b.opacity, lineHeight: 1 }}
          animate={{ y: [0, -(b.size * 0.25), 0], rotate: [0, 20, -20, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⚽
        </motion.div>
      ))}

      {/* Extras: líneas de campo + confeti */}
      {extras && (
        <>
          {/* Líneas laterales */}
          <div className="absolute left-[7%] top-0 bottom-0 w-px hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)' }} />
          <div className="absolute right-[7%] top-0 bottom-0 w-px hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)' }} />

          {/* Confeti */}
          {[
            { color: '#FFD700', x: '15%', delay: 0 },
            { color: '#e63946', x: '30%', delay: 0.4 },
            { color: '#4CAF50', x: '55%', delay: 0.8 },
            { color: '#2196F3', x: '70%', delay: 0.2 },
            { color: '#FF9800', x: '82%', delay: 1.1 },
          ].map((c, i) => (
            <motion.div key={`conf-${i}`}
              className="absolute w-2 h-5 rounded-sm"
              style={{ background: c.color, left: c.x, top: '-10px', opacity: 0.5 }}
              animate={{ y: ['0vh', '105vh'], rotate: [0, 360, 720], opacity: [0.6, 0.3, 0] }}
              transition={{ duration: 5 + i * 0.6, delay: c.delay + i * 1.2, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </>
      )}
    </div>
  );
}
