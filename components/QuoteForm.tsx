
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import QuoteFormReact from './QuoteFormReact';
import MascotImage from './eva/MascotImage';
import { motion } from 'framer-motion';
import { WORLD_CUP_SEASON } from '../constants/worldCupTheme';

const QuoteForm: React.FC = () => {
  const { t } = useLanguage();

  // Datos de beneficios/promociones con iconos temáticos de seguros
  const benefits = [
    {
      emoji: '🛡️',
      title: t('home.benefits.card1.title'),
      description: t('home.benefits.card1.description'),
      color: WORLD_CUP_SEASON ? 'bg-white/8 border border-white/10 text-white' : 'bg-blue-50 text-blue-700',
      iconBg: WORLD_CUP_SEASON ? 'bg-white/10 text-white' : 'bg-blue-100 text-blue-600',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'
    },
    {
      emoji: '💵',
      title: t('home.benefits.card2.title'),
      description: t('home.benefits.card2.description'),
      color: WORLD_CUP_SEASON ? 'bg-white/8 border border-white/10 text-white' : 'bg-green-50 text-green-700',
      iconBg: WORLD_CUP_SEASON ? 'bg-white/10 text-white' : 'bg-green-100 text-green-600',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z'
    },
    {
      emoji: '⚡',
      title: t('home.benefits.card3.title'),
      description: t('home.benefits.card3.description'),
      color: WORLD_CUP_SEASON ? 'bg-white/8 border border-white/10 text-white' : 'bg-yellow-50 text-yellow-700',
      iconBg: WORLD_CUP_SEASON ? 'bg-white/10 text-white' : 'bg-yellow-100 text-yellow-600',
      icon: 'M7 2v11h3v9l7-12h-4l4-8z'
    },
    {
      emoji: '📱',
      title: t('home.benefits.card4.title'),
      description: t('home.benefits.card4.description'),
      color: WORLD_CUP_SEASON ? 'bg-white/8 border border-white/10 text-white' : 'bg-purple-50 text-purple-700',
      iconBg: WORLD_CUP_SEASON ? 'bg-white/10 text-white' : 'bg-purple-100 text-purple-600',
      icon: 'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z'
    },
    {
      emoji: '👨‍👩‍👧‍👦',
      title: t('home.benefits.card5.title'),
      description: t('home.benefits.card5.description'),
      color: WORLD_CUP_SEASON ? 'bg-white/8 border border-white/10 text-white' : 'bg-red-50 text-red-700',
      iconBg: WORLD_CUP_SEASON ? 'bg-white/10 text-white' : 'bg-red-100 text-red-600',
      icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'
    },
    {
      emoji: '🛟',
      title: 'Asistencia 24/7',
      description: 'Servicio de emergencia disponible las 24 horas del día.',
      color: WORLD_CUP_SEASON ? 'bg-white/8 border border-white/10 text-white' : 'bg-cyan-50 text-cyan-700',
      iconBg: WORLD_CUP_SEASON ? 'bg-white/10 text-white' : 'bg-cyan-100 text-cyan-600',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'
    }
  ];

  // Función para obtener beneficios aleatorios
  const getRandomBenefits = (count: number) => {
    const shuffled = [...benefits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const leftBenefits = getRandomBenefits(3);
  const rightBenefits = getRandomBenefits(3);

  return (
    <section className={WORLD_CUP_SEASON ? 'relative py-8 md:py-12 w-full bg-transparent overflow-hidden' : 'py-8 md:py-12 w-full bg-gradient-to-b from-white to-gray-50'} id="quote-form">

      {/* ── Decoraciones mundialistas ── */}
      {WORLD_CUP_SEASON && (
        <>
          {/* Balones flotantes sutiles a los lados */}
          {[
            { size: 52, x: '1.5%', y: '20%', delay: 0,   dur: 6   },
            { size: 32, x: '4%',   y: '60%', delay: 1.5, dur: 7.5 },
            { size: 24, x: '2%',   y: '85%', delay: 0.7, dur: 5   },
            { size: 60, x: '93%',  y: '15%', delay: 0.5, dur: 8   },
            { size: 36, x: '95%',  y: '55%', delay: 1.2, dur: 6.5 },
            { size: 22, x: '92%',  y: '82%', delay: 0.3, dur: 5.5 },
          ].map((b, i) => (
            <motion.div key={i} aria-hidden className="pointer-events-none absolute select-none hidden lg:block"
              style={{ left: b.x, top: b.y, fontSize: b.size, opacity: 0.08 }}
              animate={{ y: [0, -16, 0], rotate: [0, 25, -25, 0] }}
              transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
            >⚽</motion.div>
          ))}

          {/* Líneas laterales de campo muy sutiles */}
          <div aria-hidden className="pointer-events-none absolute left-[7%] top-0 bottom-0 w-px opacity-[0.05] hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)' }} />
          <div aria-hidden className="pointer-events-none absolute right-[7%] top-0 bottom-0 w-px opacity-[0.05] hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)' }} />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-12 max-w-4xl mx-auto">
          {/* Mascota centrada arriba y badge debajo */}
          <div className="flex items-center justify-center mb-3">
            <MascotImage
              srcWebp="/eva/eva-baby-clipboard.webp"
              srcPng="/eva/eva-baby-clipboard.png"
              alt="EVA te ayuda a cotizar"
              className="w-28 h-auto md:w-32"
            />
          </div>
          <span className={WORLD_CUP_SEASON ? 'inline-block bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-2' : 'inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-2'}>
            Cotización en Línea
          </span>
          <h2 className={WORLD_CUP_SEASON ? 'text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight' : 'text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight'}>
            {t('quoteForm.title')}
          </h2>
          <div className={WORLD_CUP_SEASON ? 'w-20 h-1 bg-yellow-400 mx-auto mb-6 rounded-full' : 'w-20 h-1 bg-blue-600 mx-auto mb-6 rounded-full'}></div>
          <p className={WORLD_CUP_SEASON ? 'text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed' : 'text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'}>
            {t('quoteForm.subtitle')}
          </p>
          
          {/* Process Steps with Enhanced Arrows */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-center relative px-4">
              {Array.isArray(t('quoteForm.steps')) && (t('quoteForm.steps') as string[]).map((step, index, array) => (
                <React.Fragment key={index}>
                  <div className={WORLD_CUP_SEASON ? 'flex flex-col items-center relative z-10 bg-transparent px-2 group' : 'flex flex-col items-center relative z-10 bg-white px-2 group'}>
                    <div className={WORLD_CUP_SEASON ? 'w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center text-xl font-bold mb-2 border-2 border-white/20 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105' : 'w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold mb-2 border-2 border-blue-200 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-blue-300 group-hover:scale-105'}>
                      <span className="relative z-10">{index + 1}</span>
                      <div className={WORLD_CUP_SEASON ? 'absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300' : 'absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300'}></div>
                    </div>
                    <span className={WORLD_CUP_SEASON ? 'text-sm font-medium text-slate-300 text-center transition-colors duration-300' : 'text-sm font-medium text-gray-700 text-center transition-colors duration-300 group-hover:text-blue-700'}>{step}</span>
                  </div>
                  {index < array.length - 1 && (
                    <div className="flex-1 h-1 mx-1 relative">
                      <div className={WORLD_CUP_SEASON ? 'absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full overflow-hidden' : 'absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full overflow-hidden'}>
                        <div className={WORLD_CUP_SEASON ? 'h-full bg-gradient-to-r from-white/10 via-white/20 to-white/10 w-full animate-pulse-slow' : 'h-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 w-full animate-pulse-slow'}></div>
                      </div>
                      <div className={WORLD_CUP_SEASON ? 'absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md' : 'absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Animation keyframes */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes pulse-slow {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
              .animate-pulse-slow {
                animation: pulse-slow 3s ease-in-out infinite;
              }
            `
          }} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Beneficios lado izquierdo */}
          <div className="hidden lg:block w-full lg:w-1/4 space-y-4 sticky top-6">
            {WORLD_CUP_SEASON ? (
              // Tips coloridos modo mundial
              [
                { bg: 'linear-gradient(135deg,#1d4ed8,#2563eb)', icon: '🛡️', tag: 'Tip de seguro', title: 'Cotiza con tu VIN', desc: 'Tu número VIN tiene 17 caracteres y está en el parabrisas. Con él obtienes la cotización más precisa.' },
                { bg: 'linear-gradient(135deg,#059669,#10b981)', icon: '💰', tag: '¿Sabías que...?', title: 'Ahorra hasta 30%', desc: 'Cotizar en línea con Intercoast puede ahorrarte hasta un 30% vs agencias tradicionales.' },
                { bg: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', icon: '📋', tag: 'Requisito', title: 'Solo necesitas', desc: 'Tu licencia de manejo, VIN del vehículo y fecha de nacimiento. ¡Listo en 2 minutos!' },
              ].map((tip, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="rounded-2xl p-5 shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
                  style={{ background: tip.bg }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <span className="text-xs font-bold text-white/70 uppercase tracking-wide">{tip.tag}</span>
                  </div>
                  <h3 className="font-extrabold text-white text-base mb-1.5">{tip.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{tip.desc}</p>
                </motion.div>
              ))
            ) : (
              leftBenefits.map((benefit, index) => (
                <div key={`left-${index}`} className={`${benefit.color} p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className={`w-12 h-12 ${benefit.iconBg} rounded-full flex items-center justify-center mb-4`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d={benefit.icon}/></svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-opacity-90">{benefit.description}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulario React nativo */}
          <div className="w-full lg:w-2/4">
            <div className={WORLD_CUP_SEASON ? 'rounded-2xl overflow-hidden' : 'bg-white rounded-xl shadow-lg overflow-hidden'}
              style={WORLD_CUP_SEASON ? { boxShadow: '0 0 0 1px rgba(255,215,0,0.2), 0 25px 60px -10px rgba(0,0,0,0.5), 0 0 40px -5px rgba(255,215,0,0.1)' } : {}}
            >
              <QuoteFormReact />
            </div>
            <div className="mt-4 text-center">
              <p className={WORLD_CUP_SEASON ? 'text-xs text-slate-500' : 'text-xs text-gray-500'}>
                {t('quoteForm.disclaimer')}
              </p>
            </div>
          </div>
          
          {/* Beneficios lado derecho */}
          <div className="hidden lg:block w-full lg:w-1/4 space-y-4 sticky top-6">
            {WORLD_CUP_SEASON ? (
              <>
                {[
                  { bg: 'linear-gradient(135deg,#b45309,#d97706)', icon: '⚡', tag: 'Rapidez', title: 'Respuesta en 2 min', desc: 'Recibe tu estimado de precio al instante. Sin esperas, sin burocracia.' },
                  { bg: 'linear-gradient(135deg,#be123c,#e11d48)', icon: '🌎', tag: 'Sin barreras', title: '¿Sin papeles?', desc: 'Tenemos opciones para todos. Con o sin licencia californiana. Llámanos.' },
                  { bg: 'linear-gradient(135deg,#0369a1,#0284c7)', icon: '📞', tag: 'Soporte', title: 'Atención en español', desc: 'Nuestro equipo está 100% en español. Llama al (562) 381-2012.' },
                ].map((tip, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="rounded-2xl p-5 shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
                    style={{ background: tip.bg }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{tip.icon}</span>
                      <span className="text-xs font-bold text-white/70 uppercase tracking-wide">{tip.tag}</span>
                    </div>
                    <h3 className="font-extrabold text-white text-base mb-1.5">{tip.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{tip.desc}</p>
                  </motion.div>
                ))}

                {/* Tarjeta "¿Por qué elegirnos?" con estilo especial */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl p-5 border border-yellow-400/30"
                  style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,165,0,0.05))' }}
                >
                  <h3 className="font-extrabold text-yellow-400 mb-3 flex items-center gap-2">
                    🏆 {t('home.whyChooseUs.title')}
                  </h3>
                  <ul className="space-y-2">
                    {Array.isArray(t('home.whyChooseUs.points')) && (t('home.whyChooseUs.points') as string[]).map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="text-yellow-400 mt-0.5 shrink-0">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </>
            ) : (
              <>
                {rightBenefits.map((benefit, index) => (
                  <div key={`right-${index}`} className={`${benefit.color} p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}>
                    <div className={`w-12 h-12 ${benefit.iconBg} rounded-full flex items-center justify-center mb-4`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d={benefit.icon}/></svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-opacity-90">{benefit.description}</p>
                  </div>
                ))}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">{t('home.whyChooseUs.title')}</h3>
                  <ul className="text-sm text-blue-700 space-y-2">
                    {Array.isArray(t('home.whyChooseUs.points')) && (t('home.whyChooseUs.points') as string[]).map((point: string, index: number) => (
                      <li key={index} className="flex items-start"><span className="mr-2">✓</span><span>{point}</span></li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Beneficios para móviles */}
        <div className="lg:hidden mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.slice(0, 4).map((benefit, index) => (
            <div key={`mobile-${index}`} className={`${benefit.color} p-4 rounded-lg shadow-sm${WORLD_CUP_SEASON ? ' backdrop-blur-sm' : ''}`}>
              <div className="flex items-start">
                <div className={`w-10 h-10 ${benefit.iconBg} rounded-full flex-shrink-0 flex items-center justify-center mr-3`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={benefit.icon}></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs opacity-90">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;
