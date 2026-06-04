import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { TagIcon } from './icons';

const OfferButton: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 right-24 z-40 sm:bottom-8 sm:right-28">
      <div 
        className="bg-[#2ECC71] text-white py-3 px-6 rounded-full inline-flex items-center gap-3 shadow-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:rotate-[-2deg] animate-pulse cursor-pointer"
        onClick={() => {
          document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <TagIcon className="h-6 w-6" />
        <p className="font-bold text-lg">{t('hero.offer')}</p>
      </div>
    </div>
  );
};

export default OfferButton;
