import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../types';
import { PhoneIcon, MenuIcon, XIcon } from './icons';
import Logo from './Logo';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera de él
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Agregar listener cuando el menú está abierto
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
    // Forzar actualización de componentes que usan el hook useLanguage
    window.dispatchEvent(new Event('languageChanged'));
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);
    
    // Cerrar menú móvil si está abierto
    if (isOpen) {
      setIsOpen(false);
    }
    
    // Desplazamiento suave al elemento
    if (element) {
      // Pequeño retraso para permitir que el menú se cierre primero
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  const navLinks = [
    { id: 'benefits', href: '#benefits', text: t('nav.benefits') },
    { id: 'quote', href: '#quote-form', text: t('nav.quote') },
    { id: 'services', href: '#policies', text: t('nav.services') },
    { id: 'testimonials', href: '#testimonials', text: t('nav.testimonials') },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 h-12 md:h-16">
      <nav className="container mx-auto px-3 sm:px-4 h-full flex items-center justify-between max-w-7xl bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="w-full flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center h-full">
            <div className="h-full flex items-center">
              <Logo 
                className="h-8 md:h-10 w-auto" 
                width={140}
              />
            </div>
          </div>

          {/* Desktop Menu - Empty div to push navigation to the right */}
          <div className="hidden md:flex-1 md:flex"></div>

          {/* Navigation and Call Button */}
          <div className="hidden md:flex items-center space-x-6 h-full">
            <nav className="flex items-center space-x-6 h-full">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.text}
                </a>
              ))}
              <a 
                href="tel:+15623812012" 
                className="ml-4 px-4 py-1.5 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                <PhoneIcon className="inline h-3 w-3 mr-1.5" />
                <span>¡Llama Ya!</span>
              </a>
            </nav>

            {/* Language Selector */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full p-0.5 shadow-inner">
              <button
                className={`px-3 py-1 text-xs rounded-full flex items-center space-x-1.5 transition-all duration-200 ${
                  language === 'es' ? 'bg-white shadow-md text-blue-600 transform scale-105' : 'text-gray-600 hover:bg-white/50'
                }`}
                onClick={() => handleSetLanguage('es')}
                title="Español"
              >
                <img 
                  src="/español.png" 
                  alt="Bandera de España" 
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs">ES</span>
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-full flex items-center space-x-1.5 transition-all duration-200 ${
                  language === 'en' ? 'bg-white shadow-md text-blue-600 transform scale-105' : 'text-gray-600 hover:bg-white/50'
                }`}
                onClick={() => handleSetLanguage('en')}
                title="English"
              >
                <img 
                  src="/ingles.png" 
                  alt="UK Flag" 
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs">EN</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2" ref={menuRef}>
            <a 
              href="tel:+15623812012"
              className="p-1.5 text-green-600 hover:text-green-700"
              aria-label="Llamar"
            >
              <PhoneIcon className="h-5 w-5" />
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1.5 text-gray-700 hover:text-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? (
                <XIcon className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`bg-white w-72 h-full shadow-xl transform transition-transform duration-200 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
              <Logo className="h-8 w-auto" width={140} />
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <div className="space-y-1 px-2">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="block px-4 py-3 text-base font-medium text-gray-800 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-1.5 h-6 rounded-full bg-blue-600 transition-all ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
                      <span>{link.text}</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-auto p-4 border-t border-gray-100">
                <div className="space-y-3">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        handleSetLanguage('es');
                        // Forzar actualización del contenido
                        window.dispatchEvent(new Event('languageChanged'));
                      }}
                      className={`px-4 py-2 text-sm rounded-full flex-1 flex items-center justify-center space-x-2 transition-all ${
                        language === 'es' 
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label="Cambiar a español"
                    >
                      <img 
                        src="/español.png" 
                        alt="" 
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                      <span>Español</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSetLanguage('en');
                        // Forzar actualización del contenido
                        window.dispatchEvent(new Event('languageChanged'));
                      }}
                      className={`px-4 py-2 text-sm rounded-full flex-1 flex items-center justify-center space-x-2 transition-all ${
                        language === 'en' 
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label="Switch to English"
                    >
                      <img 
                        src="/ingles.png" 
                        alt="" 
                        className="w-5 h-5 object-contain"
                        aria-hidden="true"
                      />
                      <span>English</span>
                    </button>
                  </div>
                  <a 
                    href="tel:+15623812012" 
                    className="block w-full px-4 py-2.5 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 flex items-center justify-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                  >
                    <PhoneIcon className="h-4 w-4 mr-1.5" />
                    <span>¡Llama Ahora! (562) 381-2012</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;