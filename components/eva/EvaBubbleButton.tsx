import React from 'react';
import { motion } from 'framer-motion';
import { WORLD_CUP_SEASON, WORLD_CUP_CONFIG } from '../../constants/worldCupTheme';

export default function EvaBubbleButton() {
  const handleClick = () => {
    try {
      window.dispatchEvent(new CustomEvent('eva:sound:open'));
      window.dispatchEvent(new CustomEvent('eva:toggle'));
      // eslint-disable-next-line no-console
      console.log('[eva] toggle dock');
    } catch {}
  };

  const bubbleSrc = WORLD_CUP_SEASON ? WORLD_CUP_CONFIG.evaAssets.bubble : null;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Abrir chat con EVA"
      className={`fixed bottom-4 right-4 z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        WORLD_CUP_SEASON
          ? 'w-24 h-24 bg-transparent rounded-none focus-visible:ring-yellow-400'
          : 'w-16 h-16 bg-sky-600 rounded-full shadow-lg focus-visible:ring-sky-400'
      }`}
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {WORLD_CUP_SEASON && bubbleSrc ? (
        <img
          src={bubbleSrc}
          alt="EVA - Chat"
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{ mixBlendMode: 'multiply' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/eva/eva-baby-wave.png';
            (e.currentTarget as HTMLImageElement).style.mixBlendMode = 'normal';
          }}
        />
      ) : (
        <picture>
          <source srcSet="/eva/eva-baby-wave.webp" type="image/webp" />
          <img src="/eva/eva-baby-wave.png" alt="EVA" className="w-12 h-12 object-contain mx-auto" />
        </picture>
      )}
    </motion.button>
  );
}
