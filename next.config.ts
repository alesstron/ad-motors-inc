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

/**
 * CONTENT-SECURITY-POLICY: lista blanca de orígenes permitidos.
 *  - script-src: Next inyecta scripts en línea para hidratar la página, por eso `'unsafe-inline'`
 *    (sin nonce, que obligaría a renderizar todo dinámico). `'unsafe-eval'` solo en desarrollo.
 *  - style-src: Tailwind/framer-motion usan estilos en línea; Google Fonts permitido.
 *  - img-src: fotos locales (/images), Unsplash y data:/blob: (miniaturas).
 *  - connect-src 'self': el sitio no llama a APIs externas (WhatsApp se abre por enlace).
 *  - frame-ancestors 'none' + object-src 'none': sin iframes ni plugins (anti-clickjacking).
 * Si algún día añades un servicio externo (analítica, mapas), agrega su dominio aquí.
 */
const isDev = process.env.NODE_ENV !== 'production';
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://*.vercel-scripts.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `img-src 'self' data: blob: https://images.unsplash.com`,
  `font-src 'self' data: https://fonts.gstatic.com`,
  `connect-src 'self' https://*.vercel-insights.com https://vitals.vercel-insights.com${isDev ? ' ws: wss:' : ''}`,
  `form-action 'self' https://api.whatsapp.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  ...(isDev ? [] : [`upgrade-insecure-requests`]),
].join('; ');

/** Encabezados de seguridad que se envían en TODAS las respuestas. */
const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  // Funciones modernas de caché y precarga de Next 16 (no requieren cambios).
  cacheComponents: true,
  partialPrefetching: true,

  // No revelar la tecnología del servidor (cabecera X-Powered-By).
  poweredByHeader: false,

  // Aplica los encabezados de seguridad a todas las rutas.
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  // Tope de 1 MB para cuerpos de Server Actions (hoy no hay ninguna; es protección anticipada).
  experimental: { serverActions: { bodySizeLimit: '1mb' } },

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
