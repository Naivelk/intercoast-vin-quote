import React from 'react';
import { motion } from 'framer-motion';

// Todos los países participantes World Cup 2026 (48 equipos)
// Usando flagcdn.com — imágenes reales de banderas
const countries = [
  // CONCACAF (hosts + clasificados)
  { code: 'us', name: 'USA' },
  { code: 'ca', name: 'Canadá' },
  { code: 'mx', name: 'México' },
  { code: 'hn', name: 'Honduras' },
  { code: 'cr', name: 'Costa Rica' },
  { code: 'pa', name: 'Panamá' },
  { code: 'jm', name: 'Jamaica' },
  { code: 'cu', name: 'Cuba' },
  // CONMEBOL
  { code: 'ar', name: 'Argentina' },
  { code: 'br', name: 'Brasil' },
  { code: 'co', name: 'Colombia' },
  { code: 'uy', name: 'Uruguay' },
  { code: 'ec', name: 'Ecuador' },
  { code: 'pe', name: 'Perú' },
  { code: 'cl', name: 'Chile' },
  { code: 'py', name: 'Paraguay' },
  { code: 've', name: 'Venezuela' },
  { code: 'bo', name: 'Bolivia' },
  // UEFA
  { code: 'es', name: 'España' },
  { code: 'de', name: 'Alemania' },
  { code: 'fr', name: 'Francia' },
  { code: 'pt', name: 'Portugal' },
  { code: 'gb-eng', name: 'Inglaterra' },
  { code: 'nl', name: 'Holanda' },
  { code: 'it', name: 'Italia' },
  { code: 'be', name: 'Bélgica' },
  { code: 'hr', name: 'Croacia' },
  { code: 'rs', name: 'Serbia' },
  { code: 'ch', name: 'Suiza' },
  { code: 'dk', name: 'Dinamarca' },
  { code: 'at', name: 'Austria' },
  { code: 'tr', name: 'Turquía' },
  { code: 'hu', name: 'Hungría' },
  { code: 'sk', name: 'Eslovaquia' },
  // CAF (África)
  { code: 'ma', name: 'Marruecos' },
  { code: 'sn', name: 'Senegal' },
  { code: 'ng', name: 'Nigeria' },
  { code: 'cm', name: 'Camerún' },
  { code: 'eg', name: 'Egipto' },
  { code: 'za', name: 'S. África' },
  { code: 'ci', name: "Costa Marfil" },
  { code: 'gh', name: 'Ghana' },
  { code: 'tn', name: 'Túnez' },
  // AFC (Asia)
  { code: 'jp', name: 'Japón' },
  { code: 'kr', name: 'Corea' },
  { code: 'au', name: 'Australia' },
  { code: 'ir', name: 'Irán' },
  { code: 'sa', name: 'Arabia S.' },
];

// Duplicamos para scroll infinito
const doubled = [...countries, ...countries];

export default function WorldCupCountries() {
  return (
    <div className="relative overflow-hidden py-5"
      style={{
        /* Franjas de césped estilo estadio — mowing pattern */
        background: `
          repeating-linear-gradient(
            90deg,
            rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 48px,
            transparent       48px, transparent       96px
          ),
          linear-gradient(180deg, #1a6b1a 0%, #1f7d1f 40%, #1a6b1a 100%)
        `,
      }}
    >
      {/* Línea blanca superior (marcación de campo) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/20" />
      {/* Línea blanca inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20" />

      {/* Brillo cenital sutil (luz del estadio desde arriba) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 70%)' }}
      />

      <p className="relative z-10 text-center text-xs font-extrabold tracking-widest text-white/90 uppercase mb-4 drop-shadow">
        ⚽ Países participantes World Cup 2026 ⚽
      </p>

      <div className="relative">
        {/* Fades laterales en verde césped */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
          style={{ background: 'linear-gradient(to right, #1a6b1a, transparent)' }}
        />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
          style={{ background: 'linear-gradient(to left, #1a6b1a, transparent)' }}
        />

        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        >
          {doubled.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 min-w-[60px]"
            >
              <div className="w-11 h-8 rounded-md overflow-hidden shadow-lg border border-white/25 flex-shrink-0 ring-1 ring-black/20">
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
              <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">
                {c.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
