import React from 'react';

const Loader: React.FC = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    <span className="sr-only">Cargando...</span>
  </div>
);

export default Loader;
