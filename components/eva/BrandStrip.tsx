import React from 'react';
import MascotImage from './MascotImage';

export default function BrandStrip() {

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="rounded-2xl border border-black/5 bg-white/85 backdrop-blur shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <MascotImage srcWebp="/eva/eva-baby-wave.webp" srcPng="/eva/eva-baby-wave.png" alt="EVA saluda" className="w-20 h-auto" />
            <div className="text-base text-neutral-700 font-medium leading-snug">EVA te acompaña durante todo el proceso.</div>
          </div>
          <div className="flex items-center gap-4">
            <MascotImage srcWebp="/eva/eva-baby-headset.webp" srcPng="/eva/eva-baby-headset.png" alt="EVA soporte" className="w-20 h-auto" />
            <div className="text-base text-neutral-700 font-medium leading-snug">Soporte amable y claro.</div>
          </div>
          <div className="flex items-center gap-4">
            <MascotImage srcWebp="/eva/eva-baby-clipboard.webp" srcPng="/eva/eva-baby-clipboard.png" alt="EVA verificada" className="w-20 h-auto" />
            <div className="text-base text-neutral-700 font-medium leading-snug">Cotiza en minutos.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
