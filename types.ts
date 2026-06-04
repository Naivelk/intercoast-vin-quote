
export type Language = 'es' | 'en';

type Primitive = string | number | boolean | null | undefined;

export type TranslationValue = Primitive | { [key: string]: any } | any[];

export type TranslationKeys = {
  [key: string]: any;
};
