import React from 'react';

interface MascotImageProps {
  srcWebp: string;
  srcPng: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export default function MascotImage({ srcWebp, srcPng, alt, className = '', width, height, onClick }: MascotImageProps) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 rounded-2xl`} aria-label={alt}>
        <picture>
          <source srcSet={srcWebp} type="image/webp" />
          <img src={srcPng} alt={alt} className={className} width={width} height={height} />
        </picture>
      </button>
    );
  }
  // Decorative (no onClick): render as plain picture/img and force centering
  return (
    <picture>
      <source srcSet={srcWebp} type="image/webp" />
      <img src={srcPng} alt={alt} className={`block mx-auto ${className}`} width={width} height={height} />
    </picture>
  );
}
