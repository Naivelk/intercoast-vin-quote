import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';

export default function EvaPhoneDock({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)').matches,
    []
  );

  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener('eva:toggle', onToggle);
    window.addEventListener('eva:dock:open', onOpen);
    window.addEventListener('eva:dock:close', onClose);
    // Expose safe imperative API
    (window as any).evaOpenDock = onOpen;
    (window as any).evaCloseDock = onClose;
    // URL hash fallback: #chat opens, removing hash closes
    const onHash = () => {
      if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('chat')) {
        onOpen();
      }
    };
    window.addEventListener('hashchange', onHash);
    // initial check
    onHash();
    return () => {
      window.removeEventListener('eva:toggle', onToggle);
      window.removeEventListener('eva:dock:open', onOpen);
      window.removeEventListener('eva:dock:close', onClose);
      window.removeEventListener('hashchange', onHash);
      try { delete (window as any).evaOpenDock; delete (window as any).evaCloseDock; } catch {}
    };
  }, []);

  useEffect(() => {
    if (open) {
      // lock background scroll
      document.documentElement.style.overflow = 'hidden';
      try {
        if (!window.location.hash.toLowerCase().includes('chat')) {
          history.replaceState(null, '', '#chat');
        }
      } catch {}
    } else {
      document.documentElement.style.overflow = '';
      try {
        if (window.location.hash.toLowerCase().includes('chat')) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch {}
    }
    return () => { document.documentElement.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent('eva:sound:close'));
            }}
            aria-hidden
          />

          {/* Box */}
          <motion.div
            className="fixed bottom-5 right-5 w-[400px] max-w-[96vw] h-[min(86vh,720px)] max-h-[calc(100svh-2.5rem)]
                       rounded-[26px] bg-white shadow-2xl ring-1 ring-black/10 flex flex-col overflow-hidden"
            initial={{ x: isMobile ? 0 : 30, y: isMobile ? 30 : 0, scale: 0.98, opacity: 0 }}
            animate={{ x: 0, y: 0, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 420, damping: 28 } }}
            exit={{ x: isMobile ? 0 : 30, y: isMobile ? 30 : 0, scale: 0.98, opacity: 0, transition: { duration: 0.18 } }}
            role="dialog"
            aria-modal="true"
            aria-label="Chat EVA"
          >
            {/* Notch */}
            <div className="relative h-5">
              <div className="absolute left-1/2 -translate-x-1/2 top-1 h-2.5 w-24 rounded-full bg-black/80" aria-hidden />
            </div>

            {/* Header (44–48px) */}
            <div className="flex items-center justify-between w-full px-4 pr-3 py-2 min-h-[48px] bg-white/90 backdrop-blur shadow-sm z-10">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="shrink-0">
                  <picture>
                    <source srcSet="/eva/eva-baby-headset.webp" type="image/webp" />
                    <img
                      src="/eva/eva-baby-headset.png"
                      alt="EVA"
                      className="w-10 h-10 rounded-full ring-1 ring-black/10 object-contain"
                    />
                  </picture>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-gray-900 leading-none truncate">EVA</div>
                  <div className="mt-0.5 grid grid-cols-[auto_auto] items-center gap-x-2 gap-y-0.5">
                    <span className="hidden sm:block text-[12px] text-neutral-500 truncate">Asistente virtual</span>
                    <span className="inline-flex items-center gap-1.5 px-0 py-0 whitespace-nowrap" aria-live="polite">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" aria-hidden />
                      <span className="text-[12px] text-neutral-600">En línea</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => { try { window.dispatchEvent(new CustomEvent('chatbot:reset')); } catch {} }}
                  aria-label="Reiniciar chat"
                  className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                  title="Reiniciar chat"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent('eva:sound:close')); }}
                  aria-label="Cerrar chat"
                  className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages area (>=60% height) */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pt-3 pb-2"
              id="eva-messages-area"
              style={{ scrollBehavior: 'smooth', scrollbarWidth: 'thin' as any }}
            >
              {children /* Chat timeline goes here */}
            </div>

            {/* Input slot */}
            <div className="border-t border-gray-100 bg-white px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
              <div id="eva-input-slot" />
            </div>

            {/* Bottom pill */}
            <div className="h-6 bg-gradient-to-t from-gray-50 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
