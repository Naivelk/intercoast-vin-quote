import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EvaAvatar from './chatbot/EvaAvatar';
import { openChatbot } from './chatbot/eventBus';
import { X, MessageCircle } from 'lucide-react';

interface EvaPhoneDockProps {
  children: React.ReactNode;
}

const EvaPhoneDock: React.FC<EvaPhoneDockProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches, []);

  const variants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 0 : 40,
      y: isMobile ? 40 : 0,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 420, damping: 28 },
    },
    exit: {
      opacity: 0,
      x: isMobile ? 0 : 40,
      y: isMobile ? 40 : 0,
      scale: 0.98,
      transition: { duration: 0.18 },
    },
  };

  const quickChips = ['Cotizar seguro de auto 🚗', 'Oficinas y contacto 📍', '¿Qué puedo preguntar? ❓'];

  // Global open/close controls
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    const onToggle = () => setOpen((v) => !v);
    window.addEventListener('eva:dock:open', onOpen);
    window.addEventListener('eva:dock:close', onClose);
    window.addEventListener('eva:toggle', onToggle);
    return () => {
      window.removeEventListener('eva:dock:open', onOpen);
      window.removeEventListener('eva:dock:close', onClose);
      window.removeEventListener('eva:toggle', onToggle);
    };
  }, []);

  return (
    <>
      {/* Burbuja flotante */}
      <motion.button
        className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
        style={{ backgroundColor: '#0ea5e9' }}
        onClick={() => { setOpen(true); window.dispatchEvent(new CustomEvent('eva:sound:open')); }}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        aria-label="Abrir chat EVA"
      >
        <img src="/eva/eva-baby-wave.webp" alt="Abrir chat EVA" className="w-10 h-10" />
      </motion.button>

      {/* Dock tipo teléfono */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Capa oscura clicable para cerrar en mobile */}
            <div className="absolute inset-0 bg-black/30" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('eva:sound:close')); }} />

            <motion.div
              className="absolute bottom-4 right-4 w-[380px] h-[680px] max-w-[92vw] max-h-[88vh] bg-white rounded-[28px] shadow-2xl ring-1 ring-black/10 overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Chat EVA"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Notch / header */}
              <div className="relative bg-white">
                {/* Notch */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2 h-5 w-28 bg-black/80 rounded-b-2xl" aria-hidden />
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-6 pb-3">
                  <div className="flex items-center gap-3">
                    <EvaAvatar size={26} />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">EVA</div>
                      <div className="text-xs text-gray-500">Intercoast Insurance</div>
                    </div>
                  </div>
                  <button onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('eva:sound:close')); }} aria-label="Cerrar chat" className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                {/* Chips de acciones rápidas */}
                <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => openChatbot(chip)}
                      className="shrink-0 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-200"
                      aria-label={`Acción rápida: ${chip}`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-gray-100" />
              </div>

              {/* Área del contenido (inyectamos el <Chatbot />) */}
              <div className="flex-1 min-h-0 bg-white">
                {children}
              </div>

              {/* Footer decorativo tipo apps de mensajería */}
              <div className="px-4 py-2 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t border-gray-100 text-[11px] text-gray-500 flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Eva puede cometer errores. Verifica información importante.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EvaPhoneDock;
