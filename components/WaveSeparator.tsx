
import React from 'react';

interface WaveSeparatorProps {
  direction: 'up' | 'down';
  fillColor: string;
  height?: string;
}

const WaveSeparator: React.FC<WaveSeparatorProps> = ({ direction, fillColor, height = '100px' }) => {
  const wrapperClass = direction === 'up' ? 'rotate-180' : '';

  return (
    <div className={`overflow-hidden leading-[0] ${wrapperClass}`}>
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block"
        style={{ width: 'calc(100% + 1.3px)', height: height }}
      >
        <path
          d={direction === 'up' ? "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" : "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"}
          className="shape-fill"
          style={{ fill: fillColor }}
        ></path>
      </svg>
    </div>
  );
};

export default WaveSeparator;
