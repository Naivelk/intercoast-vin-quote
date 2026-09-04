import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const OfferButton: React.FC = () => {
  const whatsappUrl =
    'https://wa.me/15623787804?text=Hola%2C%20necesito%20ayuda%20con%20un%20seguro%20de%20Intercoast%20Insurance.';

  return (
    <div className="fixed bottom-6 right-28 z-[55] hidden md:block sm:bottom-8">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar con Intercoast Insurance por WhatsApp"
        title="WhatsApp"
        className="group grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-[0_16px_40px_rgba(37,211,102,0.35)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35"
      >
        <FaWhatsapp className="h-8 w-8 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
      </a>
    </div>
  );
};

export default OfferButton;
