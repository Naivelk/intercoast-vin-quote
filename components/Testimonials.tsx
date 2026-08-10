import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { StarIcon } from './icons';

const reviews = [
  { key: 'review1', clientKey: 'client1', avatar: 'MG' },
  { key: 'review2', clientKey: 'client2', avatar: 'CR' },
  { key: 'review3', clientKey: 'client3', avatar: 'JL' },
  { key: 'review4', clientKey: 'client4', avatar: 'RM' },
  { key: 'review5', clientKey: 'client5', avatar: 'AP' },
  { key: 'review6', clientKey: 'client6', avatar: 'MT' },
];

const avatarColors = [
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-orange-500 to-orange-700',
  'from-sky-500 to-sky-700',
  'from-rose-500 to-rose-700',
];

const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white" id="testimonials">
      <div className="container mx-auto px-6">

        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Google Reviews ⭐ 4.9 / 5
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Grid de reseñas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map(({ key, clientKey, avatar }, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Estrellas */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-[#FFC107] fill-[#FFC107]" />
                ))}
              </div>

              {/* Texto reseña */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                "{t(`testimonials.${key}`)}"
              </p>

              {/* Cliente */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[idx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#212529] text-sm">
                    {t(`testimonials.${clientKey}`)}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-[10px] text-gray-400">Google Review</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Google Reviews */}
        <div className="text-center mt-12">
          <a
            href="https://g.page/r/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Déjanos tu opinión en Google
          </a>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
