import React from 'react';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'default' | 'white';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  width = 240, 
  height = 'auto',
  variant = 'default'
}) => {
  // Estilos basados en la variante
  const containerClass = `inline-block ${className}`;
  const imgClass = 'w-full h-auto object-contain';
  
  return (
    <div className={containerClass} style={{ width, height }}>
      <img 
        src="/logogrande.png" 
        alt="Intercoast Insurance Logo"
        className={imgClass}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        onError={(e) => {
          // Fallback en caso de que la imagen no se cargue
          const target = e.target as HTMLImageElement;
          target.src = `https://via.placeholder.com/${width}x${height}/003E73/ffffff?text=INTERCOAST+INSURANCE`;
        }}
      />
    </div>
  );
};

export default Logo;
