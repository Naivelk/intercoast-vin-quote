
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { PhoneIcon, MessageCircleIcon, SendIcon } from './icons';

const offices = [
  {
    name: 'South Gate',
    address: '5863 Imperial Hwy, South Gate, CA 90280',
    phone: '(562) 381-2012',
    hours: 'Lun – Sáb: 9am – 6pm',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.5!2d-118.2073!3d33.9392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2cba3b4c1f4ab%3A0x0!2s5863+Imperial+Hwy%2C+South+Gate%2C+CA+90280!5e0!3m2!1ses!2sus!4v1699999999999!5m2!1ses!2sus',
    mapsLink: 'https://maps.google.com/?q=5863+Imperial+Hwy,+South+Gate,+CA+90280',
  },
  {
    name: 'Compton',
    address: '920 N Long Beach Blvd, Compton, CA 90221',
    phone: '(562) 408-0620',
    hours: 'Lun – Sáb: 9am – 6pm',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.2!2d-118.2195!3d33.9001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2cba3b4c1f4ab%3A0x0!2s920+N+Long+Beach+Blvd%2C+Compton%2C+CA+90221!5e0!3m2!1ses!2sus!4v1699999999998!5m2!1ses!2sus',
    mapsLink: 'https://maps.google.com/?q=920+N+Long+Beach+Blvd,+Compton,+CA+90221',
  },
];

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#F8F9FA]" id="contact">
      <div className="container mx-auto px-6">

        {/* Encabezado */}
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            📍 Visítanos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#212529]">{t('contact.title')}</h2>
          <p className="text-gray-500 mt-4 text-lg">{t('contact.subtitle')}</p>
        </div>

        {/* Botones de contacto */}
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-5 mb-16 text-center">
          <a
            className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            href="tel:+15623812012"
          >
            <PhoneIcon className="text-[#0057D9] h-10 w-10 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-1 text-[#212529]">{t('contact.callTitle')}</h3>
            <p className="text-gray-500 text-sm mb-3">{t('contact.callText')}</p>
            <span className="bg-[#0057D9] text-white font-bold py-2.5 px-5 rounded-full inline-flex items-center justify-center gap-2 text-sm transition-all hover:scale-105 shadow">
              (562) 381-2012
            </span>
          </a>
          <a
            className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            href="https://wa.me/15623812012"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircleIcon className="text-[#0057D9] h-10 w-10 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-1 text-[#212529]">{t('contact.whatsappTitle')}</h3>
            <p className="text-gray-500 text-sm mb-3">{t('contact.whatsappText')}</p>
            <span className="bg-[#25D366] text-white font-bold py-2.5 px-5 rounded-full inline-flex items-center justify-center gap-2 text-sm transition-all hover:scale-105 shadow">
              <SendIcon className="h-4 w-4" />
              {t('contact.whatsappCta')}
            </span>
          </a>
        </div>

        {/* Sección de mapas */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-[#212529] text-center mb-8">Nuestras Oficinas</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {offices.map((office, idx) => (
              <motion.div
                key={office.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
              >
                {/* Mapa embed */}
                <div className="relative w-full h-52">
                  <iframe
                    title={`Mapa oficina ${office.name}`}
                    src={office.mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Info oficina */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                        Oficina {office.name}
                      </span>
                      <p className="font-semibold text-[#212529] text-sm">{office.address}</p>
                      <p className="text-gray-500 text-xs mt-1">📞 {office.phone}</p>
                      <p className="text-gray-400 text-xs mt-0.5">🕐 {office.hours}</p>
                    </div>
                    <a
                      href={office.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#0057D9] hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-colors shadow-sm whitespace-nowrap"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Cómo llegar
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
