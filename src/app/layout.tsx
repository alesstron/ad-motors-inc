/**
 * ============================================================================
 *  src/app/layout.tsx — PLANTILLA HTML BASE DE TODO EL SITIO
 * ============================================================================
 *  En Next.js, `layout.tsx` es el "marco" que envuelve a todas las páginas:
 *  aquí se define la etiqueta <html>, el <body>, el idioma, las fuentes y el
 *  título que aparece en la pestaña del navegador. Todo lo que pongas en
 *  `page.tsx` se inserta donde dice `{children}`.
 *
 *  Qué puedes cambiar aquí:
 *   - Título y descripción (SEO / Google)  → objeto `metadata`.
 *   - Color de la barra del navegador móvil → `viewport.themeColor`.
 *   - Idioma de la página                   → `lang="es"` en <html>.
 *   - Fuentes                               → `Geist` / `Geist_Mono` de abajo.
 * ============================================================================
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import MotionProvider from '@/components/motion/MotionProvider';
import './globals.css'; // estilos globales (colores base, degradado metálico, sliders…)

/**
 * Fuente principal (Geist). Next la descarga en la compilación y la sirve
 * desde tu propio sitio. `variable` crea una variable CSS que usa globals.css.
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

/** Fuente monoespaciada (para código o cifras técnicas, si se necesitan). */
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * Datos para buscadores y pestañas del navegador.
 *  - `title`:       texto de la pestaña y título del resultado en Google.
 *  - `description`: resumen que Google muestra bajo el título.
 */
export const metadata: Metadata = {
  title: 'AD Motors INC. — Concesionario de alta gama en Venezuela',
  description:
    'Camionetas 4x4, pick-ups, deportivos y sedanes de lujo con inspección multipunto y entrega a domicilio a nivel nacional. Sede principal en Barquisimeto.',
};

/** Ajustes de la ventana de visualización: color de la barra del navegador móvil y modo oscuro. */
export const viewport: Viewport = {
  themeColor: '#09090b',
  colorScheme: 'dark',
};

/**
 * Componente raíz: dibuja <html> y <body> y coloca la página en `{children}`.
 *  - `lang="es"`: la página está en español (ayuda a lectores de pantalla y traductores).
 *  - `bg-[#09090b]`: fondo negro profundo en toda la página.
 *  - `overflow-x-hidden w-full max-w-full`: evita el scroll lateral (espacio blanco) en celulares.
 *    Va solo en <body> (el navegador lo aplica a toda la ventana y no rompe el `sticky`).
 *  - `min-h-full flex flex-col`: el cuerpo ocupa al menos toda la pantalla, para que
 *    el pie de página quede siempre abajo aunque haya poco contenido.
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-[#09090b] antialiased`}
    >
      <body className="flex min-h-full w-full max-w-full flex-col overflow-x-hidden bg-[#09090b] text-zinc-50">
        {/* MotionProvider respeta "reducir movimiento" del dispositivo en todas las animaciones. */}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
