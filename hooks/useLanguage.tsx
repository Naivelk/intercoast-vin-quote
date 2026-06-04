
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../constants/translations';

// Crear un estado global para el idioma
let globalLanguage: Language = 'es';
const languageListeners = new Set<() => void>();

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: <T extends string | string[] = string>(key: string) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const notifyLanguageChange = () => {
  languageListeners.forEach(listener => listener());
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(globalLanguage);

  // Sincronizar con el estado global
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageState(globalLanguage);
    };

    languageListeners.add(handleLanguageChange);
    return () => {
      languageListeners.delete(handleLanguageChange);
    };
  }, []);

  // Actualizar el idioma en el documento
  useEffect(() => {
    document.documentElement.lang = language;
    globalLanguage = language;
    notifyLanguageChange();
  }, [language]);

  // Función para traducir
  const t = useCallback(<T extends string | string[]>(key: string): T => {
    const keys = key.split('.');
    let result: any = translations[globalLanguage];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key as unknown as T;
      }
    }
    
    return result as T;
  }, [language]);

  // Función para cambiar el idioma
  const setLanguage = useCallback((newLanguage: Language) => {
    if (newLanguage !== globalLanguage) {
      globalLanguage = newLanguage;
      setLanguageState(newLanguage);
      notifyLanguageChange();
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
