import React, { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import Logo from './Logo';
import { motion } from 'framer-motion';
import { WORLD_CUP_SEASON } from '../constants/worldCupTheme';
import WorldCupHeroDecor from './worldcup/WorldCupHeroDecor';

const stats = [
  { value: '10K+', label: 'Clientes' },
  { value: '4.9★', label: 'Google' },
  { value: '15+',  label: 'Años' },
  { value: 'A+',   label: 'BBB' },
];

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { setIsLoaded(true); }, []);

  const openChat = () => {
    try {
      window.dispatchEvent(new CustomEvent('eva:dock:open'));
      window.dispatchEvent(new CustomEvent('eva:sound:open'));
    } catch {}
  };
  const scrollToQuote = () => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: 'linear-gradient(150deg, #00275c 0%, #003E73 30%, #0057a8 65%, #003060 100%)' }}
    >
      {WORLD_CUP_SEASON && <WorldCupHeroDecor />}

      {/* Malla de puntos sutil */}
      <div aria-hidden className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      {/* Glow central */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(0,140,255,0.18) 0%, transparent 70%)' }}
      />

      {/* ── Imagen izquierda: póliza / escudo ── */}
      <motion.div
        className="hidden md:block absolute z-0 pointer-events-none"
        style={{ left: '2%', bottom: '8%', width: '18vw', maxWidth: 260, minWidth: 140 }}
        initial={{ opacity: 0, x: -30 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.6 }}
      >
        <motion.img
          src="/hero/izquierda3.png"
          alt="Póliza de seguro"
          className="w-full h-auto object-contain"
          draggable={false}
          style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* ── Imagen derecha: auto + moto ── */}
      <motion.div
        className="hidden md:block absolute z-0 pointer-events-none"
        style={{ right: 0, bottom: '5%', width: '28vw', maxWidth: 420, minWidth: 180 }}
        initial={{ opacity: 0, x: 30 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.7 }}
      >
        <motion.img
          src="/hero/derecha2.png"
          alt="Auto y moto asegurados"
          className="w-full h-auto object-contain"
          draggable={false}
          style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.5))' }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* ── Contenido central ── */}
      <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
        <div className="pt-10 md:pt-16 pb-36 md:pb-44">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-5"
          >
            <Logo variant="white" className="h-20 md:h-28 w-auto drop-shadow-2xl" width={400} />
          </motion.div>

          {/* Badge de estado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium text-white/85 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            Licencia activa en California · Servicio 100% en español
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5"
          >
            {t('hero.title').split('California').length > 1 ? (
              <>
                {t('hero.title').split('California')[0]}
                <span style={{
                  background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 60%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>California</span>
                {t('hero.title').split('California')[1]}
              </>
            ) : (
              t('hero.title')
            )}
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-8 px-4"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="mb-8"
          >
            <div className="inline-flex flex-wrap justify-center gap-3">
              <button onClick={scrollToQuote}
                className="px-7 py-3 rounded-full font-bold text-sm text-gray-900 shadow-2xl hover:scale-105 transition-all whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}
              >
                Cotizar gratis ahora →
              </button>
              <button onClick={openChat}
                className="px-7 py-3 rounded-full font-semibold text-sm text-white bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 transition-all whitespace-nowrap"
              >
                💬 Hablar con Eva
              </button>
            </div>
          </motion.div>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.72 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {[
              { icon: '✅', text: t('hero.features.secure') },
              { icon: '⚡', text: t('hero.features.fast') },
              { icon: '🕐', text: t('hero.features.easy') },
            ].map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-xs text-white/80">
                {f.icon} {f.text}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.86 }}
            className="inline-flex gap-3 sm:gap-6"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 min-w-[64px]">
                <span className="text-lg font-extrabold text-yellow-400 leading-none">{s.value}</span>
                <span className="text-[10px] text-white/50 mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Transición inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1920 80" preserveAspectRatio="none" className="w-full h-10 md:h-14 block">
          <path
            fill={WORLD_CUP_SEASON ? '#080e1a' : '#ffffff'}
            d="M0,40 C320,80 640,0 960,40 C1280,80 1600,0 1920,40 L1920,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
