import React, { useMemo, useState } from 'react';

const SavingsCalculator: React.FC = () => {
  const [vehicles, setVehicles] = useState(2);
  const [history, setHistory] = useState<'good' | 'standard'>('good');
  const savings = useMemo(() => {
    const multi = Math.min(vehicles * 6, 30);
    return history === 'good' ? Math.min(multi + 8, 30) : multi;
  }, [vehicles, history]);

  return (
    <section className="py-14 bg-slate-950 text-white" aria-labelledby="savings-title">
      <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <p className="text-amber-300 font-bold text-sm uppercase tracking-wide">Explora tus opciones</p>
          <h2 id="savings-title" className="mt-2 text-3xl md:text-4xl font-extrabold">Descubre posibles descuentos</h2>
          <p className="mt-3 text-slate-300 leading-relaxed">Una vista rápida para entender qué factores pueden mejorar tu propuesta. El precio final siempre depende de la aseguradora y la verificación.</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-300"><li>✓ Multi-auto</li><li>✓ Buen historial</li><li>✓ Pago automático y otros beneficios aplicables</li></ul>
        </div>
        <div className="rounded-2xl p-6 bg-white text-slate-900 shadow-2xl">
          <label className="block font-bold text-sm">¿Cuántos vehículos quieres asegurar?</label>
          <input aria-label="Número de vehículos" className="w-full accent-blue-600 mt-4" type="range" min="1" max="5" value={vehicles} onChange={(e) => setVehicles(Number(e.target.value))} />
          <div className="flex justify-between text-xs text-slate-500"><span>1</span><span className="font-bold text-blue-700">{vehicles} vehículos</span><span>5</span></div>
          <label className="block font-bold text-sm mt-6">Historial de manejo</label>
          <select className="mt-2 w-full rounded-lg border border-slate-300 p-3" value={history} onChange={(e) => setHistory(e.target.value as 'good' | 'standard')}>
            <option value="good">Buen historial</option><option value="standard">Estándar / por revisar</option>
          </select>
          <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4 text-center">
            <p className="text-sm text-slate-600">Posible ahorro a explorar</p><p className="text-4xl font-extrabold text-blue-700 mt-1">Hasta {savings}%</p>
            <p className="text-xs text-slate-500 mt-2">No es una oferta ni garantía de precio.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavingsCalculator;
