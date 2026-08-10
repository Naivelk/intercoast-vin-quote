import React from 'react';
import { motion } from 'framer-motion';

export default function EvaBubbleButton() {
  const handleClick = () => {
    try {
      window.dispatchEvent(new CustomEvent('eva:sound:open'));
      window.dispatchEvent(new CustomEvent('eva:toggle'));
    } catch {}
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Abrir chat con EVA"
      className="fixed bottom-5 right-5 z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400"
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      style={{ filter: 'drop-shadow(0 8px 24px rgba(14,165,233,0.35))' }}
    >
      {/* Anillo de pulso */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full animate-ping opacity-20 bg-sky-400"
        style={{ animationDuration: '2.5s' }}
      />

      {/* Círculo de fondo degradado */}
      <span
        className="relative flex items-end justify-center w-20 h-20 rounded-full overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0ea5e9 0%, #0369a1 60%, #075985 100%)',
          boxShadow: '0 4px 20px rgba(14,165,233,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <picture>
          <source srcSet="/eva/eva-baby-wave.webp" type="image/webp" />
          <img
            src="/eva/eva-baby-wave.png"
            alt="EVA"
            className="w-16 h-16 object-contain object-bottom select-none"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </picture>
      </span>

      {/* Badge "Chat" */}
      <span
        className="absolute -top-1 -right-1 flex items-center gap-0.5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md leading-none"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
        Eva
      </span>
    </motion.button>
  );
}
