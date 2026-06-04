import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORLD_CUP_CONFIG } from '../../constants/worldCupTheme';
import { useLanguage } from '../../hooks/useLanguage';

export default function WorldCupBanner() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(true);
  const text = WORLD_CUP_CONFIG.bannerText[language as 'es' | 'en'] ?? WORLD_CUP_CONFIG.bannerText.es;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden"
        >
          <div
            className="relative flex items-center justify-center px-8 py-2 text-center text-sm font-bold overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #005c28, #007a36, #FFD700, #007a36, #005c28)',
              backgroundSize: '300% 100%',
              animation: 'bannerScroll 6s linear infinite',
              color: '#fff',
            }}
          >
            {/* Brillo animado */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />

            {/* Balones decorativos */}
            <span className="mr-2 text-base">⚽</span>
            <span className="relative z-10 tracking-wide drop-shadow">{text}</span>
            <span className="ml-2 text-base">🏆</span>

            {/* Botón cerrar */}
            <button
              onClick={() => setVisible(false)}
              aria-label="Cerrar banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors text-lg leading-none font-light"
            >
              ×
            </button>
          </div>

          <style>{`
            @keyframes bannerScroll {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
