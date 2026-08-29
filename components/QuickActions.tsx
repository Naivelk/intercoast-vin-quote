import React from 'react';
import { startChatbotFlow } from './chatbot/eventBus';

const actions = [
  { icon: '🚗', title: 'Cotizar mi auto', text: 'Obtén un estimado en minutos.', prompt: 'Quiero cotizar seguro de auto 🚗', tone: 'from-blue-600 to-sky-500' },
  { icon: '🔄', title: 'Renovar mi póliza', text: 'Revisamos opciones antes del vencimiento.', prompt: 'Mi seguro se vence y quiero renovarlo', tone: 'from-violet-600 to-purple-500' },
  { icon: '📄', title: 'Necesito SR-22', text: 'Te orientamos paso a paso.', prompt: 'Necesito ayuda con SR-22', tone: 'from-amber-500 to-orange-500' },
  { icon: '🆘', title: 'Tuve un accidente', text: 'Recibe orientación inmediata.', prompt: 'Tuve un accidente y necesito ayuda', tone: 'from-rose-600 to-red-500' },
];

const QuickActions: React.FC = () => (
  <section className="bg-white py-12 md:py-16" aria-labelledby="quick-actions-title">
    <div className="max-w-6xl mx-auto px-5">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <p className="text-sm font-bold tracking-wide text-blue-600 uppercase">Estamos para ayudarte</p>
        <h2 id="quick-actions-title" className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">¿Qué necesitas hoy?</h2>
        <p className="text-slate-600 mt-3">Elige una opción y Eva te guía sin vueltas.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button key={action.title} onClick={() => startChatbotFlow(action.prompt)}
            className="group text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
            <span className={`inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.tone} text-2xl shadow-lg`}>{action.icon}</span>
            <h3 className="mt-5 font-bold text-lg text-slate-900 group-hover:text-blue-700">{action.title}</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{action.text}</p>
            <span className="mt-4 inline-block text-sm font-bold text-blue-600">Empezar →</span>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default QuickActions;
