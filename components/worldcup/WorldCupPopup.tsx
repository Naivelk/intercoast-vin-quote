import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'wc2026_popup_seen';

export default function WorldCupPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostrar solo una vez por sesión
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  const openChatAndClose = () => {
    close();
    try {
      window.dispatchEvent(new CustomEvent('eva:dock:open'));
      window.dispatchEvent(new CustomEvent('eva:sound:open'));
    } catch {}
  };

  const scrollToQuote = () => {
    close();
    setTimeout(() => {
      document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[201] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
              style={{
                background: 'linear-gradient(145deg, #0d1628 0%, #1a2d4a 50%, #0d1628 100%)',
              }}
              initial={{ scale: 0.7, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Líneas de cancha */}
              <svg aria-hidden className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
                <rect x="20" y="20" width="360" height="460" fill="none" stroke="white" strokeWidth="2"/>
                <line x1="20" y1="250" x2="380" y2="250" stroke="white" strokeWidth="2"/>
                <circle cx="200" cy="250" r="60" fill="none" stroke="white" strokeWidth="2"/>
                <rect x="20" y="160" width="90" height="180" fill="none" stroke="white" strokeWidth="2"/>
                <rect x="290" y="160" width="90" height="180" fill="none" stroke="white" strokeWidth="2"/>
              </svg>

              {/* Banderines superiores */}
              <div aria-hidden className="absolute top-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none">
                {['#e63946','#f4d03f','#2ecc71','#3498db','#e67e22','#9b59b6','#e63946','#f4d03f','#2ecc71','#3498db'].map((color, i) => (
                  <svg key={i} width="32" height="22" viewBox="0 0 36 28">
                    <polygon points="4,0 32,0 18,22" fill={color} opacity="0.9"/>
                  </svg>
                ))}
              </div>

              {/* Botón cerrar */}
              <button
                onClick={close}
                aria-label="Cerrar"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg font-light"
              >
                ×
              </button>

              {/* Contenido */}
              <div className="relative z-10 px-6 pt-8 pb-6 text-center">
                {/* Balón animado */}
                <motion.div
                  className="mb-3 inline-block"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Soccer_Ball.svg/120px-Soccer_Ball.svg.png"
                    alt="Balón de fútbol"
                    className="w-16 h-16 drop-shadow-2xl"
                  />
                </motion.div>

                <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-xs font-extrabold px-3 py-1 rounded-full mb-3">
                  🏆 TEMPORADA MUNDIALISTA 2026
                </div>

                <h2 className="text-2xl font-extrabold text-white leading-tight mt-1">
                  ¡Bienvenido a la<br/>
                  <span className="text-yellow-400">Copa del Seguro!</span>
                </h2>

                <p className="mt-3 text-slate-300 text-sm">
                  Esta temporada es especial. Cotiza tu seguro de auto hoy con Intercoast y maneja tranquilo mientras disfrutas el Mundial. 🎉
                </p>

                {/* Banderas reales */}
                <div className="mt-4">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Países participantes</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {[
                      { code: 'us', name: 'USA' },
                      { code: 'mx', name: 'México' },
                      { code: 'ar', name: 'Argentina' },
                      { code: 'br', name: 'Brasil' },
                      { code: 'co', name: 'Colombia' },
                      { code: 'uy', name: 'Uruguay' },
                      { code: 'cl', name: 'Chile' },
                      { code: 'pe', name: 'Perú' },
                      { code: 'ec', name: 'Ecuador' },
                      { code: 'ca', name: 'Canadá' },
                    ].map((c, i) => (
                      <motion.div
                        key={i}
                        className="flex flex-col items-center gap-1"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 200 }}
                      >
                        <div className="w-9 h-6 rounded overflow-hidden shadow-lg border border-white/20 ring-1 ring-black/20">
                          <img
                            src={`https://flagcdn.com/w40/${c.code}.png`}
                            srcSet={`https://flagcdn.com/w80/${c.code}.png 2x`}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[9px] text-white/50 font-medium">{c.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Botones */}
                <div className="mt-6 flex flex-col gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={scrollToQuote}
                    className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold rounded-full text-base shadow-xl transition-colors"
                  >
                    ⚽ ¡Cotizar Ahora!
                  </motion.button>
                  <button
                    onClick={openChatAndClose}
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-sm border border-white/20 transition-colors"
                  >
                    💬 Hablar con Eva primero
                  </button>
                  <button
                    onClick={close}
                    className="text-slate-400 hover:text-white text-xs transition-colors mt-1"
                  >
                    Continuar explorando
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
