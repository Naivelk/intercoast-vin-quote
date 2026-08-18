import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from './icons';

interface Review {
  office: string;
  author: string;
  rating: number;
  text: string;
  relativeTime?: string;
}

// Reseñas reales verificadas manualmente en la ficha de Google
// (no aparecen siempre en la respuesta de la API porque Google solo
// entrega un máximo de 5 "más recientes" por consulta)
const SEED_REVIEWS: Review[] = [
  {
    office: 'South Gate',
    author: 'Angelica R.',
    rating: 5,
    text: 'Tienen buenos precios y muy buena atención!',
  },
  {
    office: 'South Gate',
    author: 'Tyan Z.',
    rating: 5,
    text: 'Excelente servicio 👍🏻 Gracias por ayudar a nuestra comunidad',
  },
];

const avatarColors = [
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-orange-500 to-orange-700',
  'from-sky-500 to-sky-700',
  'from-rose-500 to-rose-700',
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function truncate(text: string, max = 260) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  useEffect(() => {
    fetch('/data/google-reviews.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.reviews?.length) return;
        setReviews((prev) => {
          const merged = [...prev];
          for (const r of data.reviews as Review[]) {
            if (!merged.some((m) => m.author === r.author)) {
              merged.push(r);
            }
          }
          return merged;
        });
      })
      .catch(() => {
        // Si falla la carga, se quedan las reseñas verificadas manualmente
      });
  }, []);

  return (
    <section className="py-24 bg-white" id="testimonials">
      <div className="container mx-auto px-6">

        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Reseñas verificadas de Google
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Opiniones reales de clientes en nuestras oficinas de South Gate y Compton.
          </p>
        </div>

        {/* Grid de reseñas */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
            >
              {/* Estrellas */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? 'text-[#FFC107] fill-[#FFC107]' : 'text-gray-300'}`}
                  />
                ))}
              </div>

              {/* Texto reseña */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                "{truncate(review.text)}"
              </p>

              {/* Cliente */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {initials(review.author)}
                </div>
                <div>
                  <p className="font-semibold text-[#212529] text-sm">{review.author}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" aria-hidden>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-[10px] text-gray-400">
                      Google Review{review.relativeTime ? ` · ${review.relativeTime}` : ''} · {review.office}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Google Reviews — dos oficinas */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {[
            { label: 'Opinar — South Gate', href: 'https://share.google/FZHguWMYADFgsPE1M' },
            { label: 'Opinar — Compton', href: 'https://share.google/36GD0XSmmvw6i8ySg' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {label}
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
