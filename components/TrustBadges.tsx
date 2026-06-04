
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { LockIcon, StarIcon, AwardIcon } from './icons';
import { WORLD_CUP_SEASON } from '../constants/worldCupTheme';

const TrustBadges: React.FC = () => {
  const { t } = useLanguage();

  const badges = [
    {
      icon: <LockIcon className={WORLD_CUP_SEASON ? 'text-green-400 h-7 w-7' : 'text-[#2ECC71] h-7 w-7'} />,
      textKey: 'hero.trustBadges.secure'
    },
    {
      icon: <StarIcon className="text-yellow-500 fill-yellow-500 h-7 w-7" />,
      textKey: 'hero.trustBadges.google'
    },
    {
      icon: <AwardIcon className={WORLD_CUP_SEASON ? 'text-yellow-400 h-7 w-7' : 'text-blue-800 h-7 w-7'} />,
      textKey: 'hero.trustBadges.bbb'
    },
  ];

  return (
    <section className={WORLD_CUP_SEASON ? 'bg-transparent py-8 border-y border-white/[0.08]' : 'py-12 bg-[#F8F9FA]'}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {badges.map((badge, index) => (
            <div key={index} className={WORLD_CUP_SEASON ? 'flex items-center justify-center space-x-3 px-6 py-3' : 'flex items-center justify-center space-x-3'}>
              {badge.icon}
              <p className={WORLD_CUP_SEASON ? 'text-slate-300 font-medium' : 'font-semibold text-gray-700'}>{t(badge.textKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
