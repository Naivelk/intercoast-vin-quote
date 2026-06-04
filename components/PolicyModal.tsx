import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../hooks/useLanguage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: {
    title: string;
    emoji: string;
    coverages: string[];
    benefits: string[];
    gradient: string;
    type: 'auto' | 'home' | 'motorcycle' | 'boat';
    description: string;
    coverageType: string[];
  } | null;
}

const getCarouselImages = (type: string) => {
  const basePath = '/images/carousel';
  const images: Record<string, { src: string; altKey: string }[]> = {
    auto: [
      { src: `${basePath}/auto/seguroauto.jpg`, altKey: 'policyModal.auto.alt1' },
      { src: `${basePath}/auto/seguroauto1.jpg`, altKey: 'policyModal.auto.alt2' },
      { src: `${basePath}/auto/seguroauto2.jpg`, altKey: 'policyModal.auto.alt3' },
    ],
    home: [
      { src: `${basePath}/home/casa.jpg`, altKey: 'policyModal.home.alt1' },
      { src: `${basePath}/home/casa1.jpg`, altKey: 'policyModal.home.alt2' },
      { src: `${basePath}/home/casa2.jpg`, altKey: 'policyModal.home.alt3' },
      { src: `${basePath}/home/casa3.jpg`, altKey: 'policyModal.home.alt4' },
    ],
    motorcycle: [
      { src: `${basePath}/motorcycle/moto.jpg`, altKey: 'policyModal.motorcycle.alt1' },
      { src: `${basePath}/motorcycle/moto1.jpg`, altKey: 'policyModal.motorcycle.alt2' },
      { src: `${basePath}/motorcycle/moto1.png`, altKey: 'policyModal.motorcycle.alt3' },
      { src: `${basePath}/motorcycle/moto2.jpg`, altKey: 'policyModal.motorcycle.alt4' },
    ],
    boat: [
      { src: `${basePath}/boat/bote.jpg`, altKey: 'policyModal.boat.alt1' },
      { src: `${basePath}/boat/bote2.jpg`, altKey: 'policyModal.boat.alt2' },
      { src: `${basePath}/boat/bote3.jpg`, altKey: 'policyModal.boat.alt3' },
    ],
  };
  
  // Filtrar solo las imágenes que existen
  const typeImages = images[type as keyof typeof images] || [];
  return typeImages.filter(img => {
    // Solo incluir la imagen si el archivo existe en la ruta pública
    try {
      // Esto es una verificación en tiempo de desarrollo
      // En producción, necesitarías una verificación del lado del servidor o asegurarte de que las rutas son correctas
      return true; // Por ahora, confiamos en que las rutas son correctas
    } catch (e) {
      console.warn(`No se pudo cargar la imagen: ${img.src}`);
      return false;
    }
  });
};

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policy }) => {
  const { t } = useLanguage();
  
  if (!policy) return null;
  
  const carouselImages = getCarouselImages(policy.type);
  


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">{t('common.close')}</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    {/* Carrusel de Imágenes */}
                <div className="relative h-64 sm:h-80 md:h-96 w-full mb-8 rounded-xl overflow-hidden shadow-xl">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={{
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev',
                    }}
                    pagination={{
                      clickable: true,
                      el: '.swiper-pagination',
                      type: 'bullets',
                      bulletClass: 'swiper-pagination-bullet bg-white/80 hover:bg-white',
                      bulletActiveClass: '!bg-blue-600',
                    }}
                    loop={true}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    className="h-full w-full group"
                  >
                    {carouselImages.map((image, index) => (
                      <SwiperSlide key={index} className="h-full w-full">
                        <div className="h-full w-full relative overflow-hidden">
                          <img
                            src={image.src}
                            alt={t(image.altKey)}
                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              // Si falla la carga, mostrar un color de fondo
                              const target = e.target as HTMLImageElement;
                              target.src = '';
                              target.className = 'w-full h-full bg-gray-200';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent"></div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Controles de navegación personalizados */}
                  <button 
                    className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg focus:outline-none transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                    aria-label={t('carousel.previous')}
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button 
                    className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg focus:outline-none transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                    aria-label={t('carousel.next')}
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                  
                  {/* Paginación personalizada */}
                  <div className="swiper-pagination !bottom-4"></div>
                </div>

                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 flex items-center"
                >
                  <span className="mr-2 text-3xl">{policy.emoji}</span>
                  {policy.title}
                </Dialog.Title>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span className={`w-1 h-6 ${policy.gradient} rounded-full mr-2`}></span>
                        {t('policyModal.includedCoverages')}
                      </h4>
                      <ul className="space-y-3">
                        {Array.isArray(policy.coverages) && policy.coverages.map((coverage, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-1">✓</span>
                            <span className="text-gray-700">{coverage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span className={`w-1 h-6 ${policy.gradient} rounded-full mr-2`}></span>
                        {t('policyModal.keyBenefits')}
                      </h4>
                      <ul className="space-y-3">
                        {Array.isArray(policy.benefits) && policy.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={onClose}
                      >
                        Cerrar
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => {
                          onClose();
                          document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Continuar con Cotización
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PolicyModal;
