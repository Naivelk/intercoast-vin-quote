/**
 * 🏆 TEMPORADA MUNDIALISTA 2026
 * ─────────────────────────────────────────────────────────────
 * Para ACTIVAR la temática mundialista:   WORLD_CUP_SEASON = true
 * Para DESACTIVAR y volver al normal:     WORLD_CUP_SEASON = false
 *
 * Eso es todo. No hay que tocar ningún otro archivo.
 * ─────────────────────────────────────────────────────────────
 */
export const WORLD_CUP_SEASON = true;

export const WORLD_CUP_CONFIG = {
  /** Texto del banner superior */
  bannerText: {
    es: '⚽ ¡Temporada Mundialista 2026! Asegura tu auto y disfruta el torneo con tranquilidad 🏆',
    en: '⚽ World Cup Season 2026! Insure your car and enjoy the tournament worry-free 🏆',
  },
  /** Colores temáticos (verde cancha + dorado copa) */
  colors: {
    primary: '#FFD700',    // dorado FIFA
    secondary: '#1a4d8f',  // azul FIFA
    accent: '#22c55e',     // verde para pequeños acentos
  },
  /** Rutas de imágenes de EVA mundialista */
  evaAssets: {
    bubble: '/eva/eva-soccer-point.png',   // botón flotante
    cta: '/eva/eva-soccer-chat.png',       // sección CTA principal
  },
};
