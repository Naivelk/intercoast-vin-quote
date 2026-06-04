
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { ShieldCheck, Zap, MessageSquareHeart, CheckCircle } from 'lucide-react';
import { WORLD_CUP_SEASON } from '../constants/worldCupTheme';
import WorldCupSectionDecor from './worldcup/WorldCupSectionDecor';

// Tipos de beneficios para el carrusel de imágenes
const benefitTypes = {
  seguro: [
    '/images/benefits/seguro1.jpg',
    '/images/benefits/seguro2.jpg',
    '/images/benefits/seguro3.jpg'
  ],
  rapidez: [
    '/images/benefits/rapidez1.jpg',
    '/images/benefits/rapidez2.jpg',
    '/images/benefits/rapidez3.jpg'
  ],
  atencion: [
    '/images/benefits/atencion1.jpg',
    '/images/benefits/atencion2.jpg',
    '/images/benefits/atencion3.jpg'
  ]
} as const;

type BenefitType = keyof typeof benefitTypes;

interface BenefitCardProps {
  icon: React.ReactElement;
  titleKey: string;
  descriptionKey: string;
  featuresKey: string[];
  delay: string;
  bgColor: string;
  iconColor: string;
  benefitType: BenefitType;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  titleKey,
  descriptionKey,
  featuresKey,
  delay,
  bgColor,
  iconColor,
  benefitType
}) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const images = benefitTypes[benefitType];

  // Efecto para el auto-avance del carrusel
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [isPaused, images.length]);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div
      className={WORLD_CUP_SEASON ? 'bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl hover:border-white/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full' : 'bg-white rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 overflow-hidden relative h-full flex flex-col'}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Image carousel */}
      <div className="h-48 sm:h-56 md:h-64 bg-gray-100 relative overflow-hidden">
        <div 
          className="h-full w-full flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`
          }}
        >
          {images.map((img, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-full h-full"
            >
              <img
                src={img}
                alt={`${titleKey} ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        {/* Navigation indicators - minimal style */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`h-1 rounded-full transition-all ${
                currentSlide === index
                  ? (WORLD_CUP_SEASON ? 'bg-yellow-400 w-4' : 'bg-blue-600 w-4')
                  : (WORLD_CUP_SEASON ? 'bg-white/30 w-2' : 'bg-gray-300 w-2')
              }`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <div className="flex items-start sm:items-center mb-3 sm:mb-4">
          <div className={`${bgColor} text-white rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center mr-3`}>
            <div className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor} transition-transform duration-300`}>
              {icon}
            </div>
          </div>
          <h3 className={WORLD_CUP_SEASON ? 'text-lg sm:text-xl font-bold text-white' : 'text-lg sm:text-xl font-bold text-gray-800'}>
            {titleKey}
          </h3>
        </div>
        <div className={WORLD_CUP_SEASON ? 'h-px bg-white/10 my-3' : 'h-px bg-gray-200 my-3'}></div>
        <p className={WORLD_CUP_SEASON ? 'text-sm sm:text-base text-slate-300 leading-relaxed mb-4 sm:mb-4' : 'text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-4'}>{descriptionKey}</p>
        <div className="mt-2 mb-4">
          <h4 className={WORLD_CUP_SEASON ? 'text-sm font-semibold text-white mb-2' : 'text-sm font-semibold text-gray-800 mb-2'}>Incluye:</h4>
          <ul className="space-y-2">
            {Array.isArray(featuresKey) && featuresKey.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className={WORLD_CUP_SEASON ? 'text-sm text-slate-300' : 'text-sm text-gray-700'}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Benefits: React.FC = () => {
  const { t } = useLanguage();
  
  const benefitsData: BenefitCardProps[] = [
    { 
      icon: React.createElement(ShieldCheck), 
      titleKey: t('benefits.card1.title'),
      descriptionKey: t('benefits.card1.description'),
      featuresKey: t<string[]>('benefits.card1.features'),
      delay: '100',
      bgColor: WORLD_CUP_SEASON ? 'bg-yellow-400/20' : 'bg-blue-100',
      iconColor: WORLD_CUP_SEASON ? 'text-yellow-400' : 'text-blue-600',
      benefitType: 'seguro' as const
    },
    { 
      icon: React.createElement(Zap),
      titleKey: t('benefits.card2.title'),
      descriptionKey: t('benefits.card2.description'),
      featuresKey: t<string[]>('benefits.card2.features'),
      delay: '200',
      bgColor: WORLD_CUP_SEASON ? 'bg-orange-400/20' : 'bg-amber-100',
      iconColor: WORLD_CUP_SEASON ? 'text-orange-400' : 'text-amber-600',
      benefitType: 'rapidez' as const
    },
    { 
      icon: React.createElement(MessageSquareHeart),
      titleKey: t('benefits.card3.title'),
      descriptionKey: t('benefits.card3.description'),
      featuresKey: t<string[]>('benefits.card3.features'),
      delay: '300',
      bgColor: WORLD_CUP_SEASON ? 'bg-green-400/20' : 'bg-green-100',
      iconColor: WORLD_CUP_SEASON ? 'text-green-400' : 'text-green-600',
      benefitType: 'atencion' as const
    },
  ];

  return (
    <section className={WORLD_CUP_SEASON ? 'relative py-20 bg-transparent overflow-hidden' : 'py-20 bg-white'} id="benefits">
      {WORLD_CUP_SEASON && <WorldCupSectionDecor density="light" />}
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto px-4">
          <span className={WORLD_CUP_SEASON ? 'inline-block bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4' : 'inline-block bg-blue-100 text-blue-600 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full mb-3 sm:mb-4'}>
            {t('benefits.badge')}
          </span>
          <h1 className={WORLD_CUP_SEASON ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-10 drop-shadow-lg text-white' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-10 drop-shadow-lg'}>
            {t('benefits.title')}
          </h1>
          <p className={WORLD_CUP_SEASON ? 'text-base sm:text-lg md:text-xl text-slate-400' : 'text-base sm:text-lg md:text-xl text-gray-600'}>
            {t('benefits.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {benefitsData.map((benefit, index) => (
            <div key={index} className="h-full">
              <BenefitCard {...benefit} />
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className={WORLD_CUP_SEASON ? 'text-slate-500 text-sm' : 'text-gray-500 text-sm'}>
            {t('benefits.note')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
