
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { PhoneIcon, MessageCircleIcon, SendIcon } from './icons';
import { WORLD_CUP_SEASON } from '../constants/worldCupTheme';
import WorldCupSectionDecor from './worldcup/WorldCupSectionDecor';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className={WORLD_CUP_SEASON ? 'relative py-20 bg-transparent overflow-hidden' : 'py-20'} id="contact">
      {WORLD_CUP_SEASON && <WorldCupSectionDecor density="heavy" extras={true} />}
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className={WORLD_CUP_SEASON ? 'text-4xl md:text-5xl font-bold text-white' : 'text-4xl md:text-5xl font-bold text-[#212529]'}>{t('contact.title')}</h2>
          <p className={WORLD_CUP_SEASON ? 'text-slate-400 mt-4 text-lg' : 'text-gray-600 mt-4 text-lg'}>{t('contact.subtitle')}</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-center">
          <a
            className={WORLD_CUP_SEASON ? 'block bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl hover:border-yellow-400/40 hover:-translate-y-2 transition-all duration-300' : 'block bg-white p-8 rounded-xl shadow-lg hover:-translate-y-2 transition-transform duration-300'}
            href="tel:+15623812012"
          >
            <PhoneIcon className={WORLD_CUP_SEASON ? 'text-yellow-400 h-12 w-12 mx-auto mb-4' : 'text-[#0057D9] h-12 w-12 mx-auto mb-4'} />
            <h3 className={WORLD_CUP_SEASON ? 'text-2xl font-bold mb-2 text-white' : 'text-2xl font-bold mb-2 text-[#212529]'}>{t('contact.callTitle')}</h3>
            <p className={WORLD_CUP_SEASON ? 'text-slate-400 mb-4' : 'text-gray-600 mb-4'}>{t('contact.callText')}</p>
            <span className={WORLD_CUP_SEASON ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 transition-colors duration-300 hover:scale-105 shadow-lg mt-4' : 'bg-[#0057D9] text-white font-bold py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 shadow-lg mt-4'}>
              (562) 381-2012
            </span>
          </a>
          <a
            className={WORLD_CUP_SEASON ? 'block bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl hover:border-yellow-400/40 hover:-translate-y-2 transition-all duration-300' : 'block bg-white p-8 rounded-xl shadow-lg hover:-translate-y-2 transition-transform duration-300'}
            href="https://wa.me/15623812012"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircleIcon className={WORLD_CUP_SEASON ? 'text-yellow-400 h-12 w-12 mx-auto mb-4' : 'text-[#0057D9] h-12 w-12 mx-auto mb-4'} />
            <h3 className={WORLD_CUP_SEASON ? 'text-2xl font-bold mb-2 text-white' : 'text-2xl font-bold mb-2 text-[#212529]'}>{t('contact.whatsappTitle')}</h3>
            <p className={WORLD_CUP_SEASON ? 'text-slate-400 mb-4' : 'text-gray-600 mb-4'}>{t('contact.whatsappText')}</p>
            <span className={WORLD_CUP_SEASON ? 'bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 transition-colors duration-300 hover:scale-105 shadow-lg mt-4' : 'bg-[#0057D9] text-white font-bold py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 shadow-lg mt-4'}>
              <SendIcon className="h-5 w-5" />
              {t('contact.whatsappCta')}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
