/**
 * ============================================================================
 *  next.config.ts — CONFIGURACIÓN DE NEXT.JS
 * ============================================================================
 *  Casi nunca necesitas tocar este archivo. La excepción más común:
 *  si quieres usar fotos de otro sitio web (no Unsplash), agrega su dominio
 *  en `images.remotePatterns`. Sin eso, Next bloquea las imágenes externas.
 *
 *  Ejemplo para permitir Cloudinary:
 *    { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' }
 * ============================================================================
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Funciones modernas de caché y precarga de Next 16 (no requieren cambios).
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    // Dominios de los que se permite cargar fotos (hoy: solo Unsplash).
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
  },

  // Conecta Tailwind CSS v4 con el compilador Turbopack de Next.
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
