import React from 'react';

const MobileActionBar: React.FC = () => (
  <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] grid grid-cols-2 gap-2 shadow-[0_-10px_25px_rgba(15,23,42,0.12)]">
    <button onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl bg-blue-700 py-3 text-sm font-bold text-white">Cotizar ahora</button>
    <a href="https://wa.me/17756754559?text=Hola%2C%20necesito%20ayuda%20con%20un%20seguro." target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-600 py-3 text-center text-sm font-bold text-white">WhatsApp</a>
  </div>
);

export default MobileActionBar;
