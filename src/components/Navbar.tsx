/**
 * ============================================================================
 *  Navbar — BARRA DE NAVEGACIÓN SUPERIOR (flotante, con efecto cristal)
 * ============================================================================
 *  Qué hace:
 *   - En computadora: logo a la izquierda, enlaces al centro y botón de
 *     WhatsApp a la derecha.
 *   - En celular: logo + botón "hamburguesa" que despliega un menú.
 *   - Se vuelve más opaca cuando haces scroll hacia abajo.
 *
 *  Cómo modificarla:
 *   - Enlaces del menú  → edita la lista `LINKS` de abajo. El `href` debe
 *     coincidir con el `id` de una sección (por ejemplo "#citas").
 *   - Nombre del negocio → src/data/site.ts (BRAND_NAME).
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CarFront, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BRAND_NAME } from '@/data/site';
import { whatsappLink } from '@/lib/whatsapp';
import { CurrencySwitch } from './CurrencySwitch';
import { GarageButton } from './GarageDrawer';

/** Enlaces del menú: `label` es lo que se lee, `href` es la sección a la que salta. */
const LINKS = [
  { href: '#inventario', label: 'Inventario' },
  { href: '#accesorios', label: 'Accesorios' },
  { href: '#servicios', label: 'Servicios VIP' },
  { href: '#citas', label: 'Citas' },
  { href: '#sedes', label: 'Sedes' },
];

/** Mensaje que llega por WhatsApp al pulsar el botón "Contactar". */
const MENSAJE = 'Hola AD Motors, me gustaría recibir asesoría sobre sus vehículos.';

/**
 * Barra superior fija: enlaces de sección, `CurrencySwitch` (USD/Bs.),
 * `GarageButton` (favoritos guardados en localStorage) y botón de WhatsApp.
 */
export function Navbar() {
  // ESTADO: ¿está abierto el menú desplegable del celular?
  const [open, setOpen] = useState(false);
  // ESTADO: ¿la persona ya bajó un poco la página? Si sí, la barra se vuelve más sólida.
  const [scrolled, setScrolled] = useState(false);

  // EFECTO: escucha el scroll de la ventana y actualiza `scrolled`.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); // evalúa una vez al cargar
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll); // limpieza al salir
  }, []);

  // EFECTO: con el menú abierto, la tecla Escape lo cierra.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    // Contenedor fijo arriba de todo (`fixed`), con margen lateral para que "flote".
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      {/* La barra: entra deslizándose desde arriba al cargar la página. */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Principal"
        className={`mx-auto max-w-5xl rounded-2xl border backdrop-blur-xl transition-colors duration-300 ${
          scrolled || open
            ? 'border-white/15 bg-neutral-900/70 shadow-2xl' // más sólida
            : 'border-white/10 bg-neutral-900/40' // más transparente
        }`}
      >
        {/* Fila principal de la barra (altura fija h-14). */}
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          {/* LOGO: cuadro blanco con icono + nombre. Lleva al inicio de la página. */}
          <a
            href="#inicio"
            className="flex items-center gap-2 rounded-lg text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            <span className="grid size-7 place-items-center rounded-lg bg-white text-zinc-900">
              <CarFront className="size-4" strokeWidth={2.25} />
            </span>
            {/* En pantallas muy angostas (<400 px) se oculta el texto y queda solo el icono,
                para que quepan el switch de moneda, el garaje y la hamburguesa. */}
            <span className="hidden min-[400px]:inline">{BRAND_NAME}</span>
            <span className="sr-only min-[400px]:hidden">{BRAND_NAME}</span>
          </a>

          {/* ENLACES (solo se ven en pantallas medianas o más grandes: `hidden md:flex`). */}
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* ACCIONES: switch USD/Bs., Garaje, WhatsApp (escritorio) y hamburguesa (celular). */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Switch global de moneda USD / Bs. */}
            <CurrencySwitch />
            {/* Garaje: corazón con el número de favoritos; abre el panel lateral. */}
            <GarageButton />
            {/* Botón "Contactar": oculto hasta pantallas grandes, donde cabe junto a los enlaces;
                en pantallas menores el menú desplegable ya trae uno. */}
            <a
              href={whatsappLink(MENSAJE)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none lg:flex"
            >
              <MessageCircle className="size-4" />
              Contactar
            </a>

            {/* Hamburguesa: tres rayas que se transforman en una "X" al abrir. */}
            <button
              type="button"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-xl text-zinc-300 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                {/* Raya de arriba: baja y gira 45° al abrir. */}
                <motion.span
                  className="absolute top-0 left-0 h-0.5 w-5 rounded-full bg-current"
                  animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                />
                {/* Raya del medio: desaparece al abrir. */}
                <motion.span
                  className="absolute top-1.5 left-0 h-0.5 w-5 rounded-full bg-current"
                  animate={{ opacity: open ? 0 : 1 }}
                />
                {/* Raya de abajo: sube y gira −45° al abrir. */}
                <motion.span
                  className="absolute top-3 left-0 h-0.5 w-5 rounded-full bg-current"
                  animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                />
              </span>
            </button>
          </div>
        </div>

        {/* MENÚ DESPLEGABLE DEL CELULAR: se expande hacia abajo con animación de altura. */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="menu-movil"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <ul className="flex flex-col gap-1 border-t border-white/10 p-3">
                {LINKS.map((l, i) => (
                  // Cada enlace entra con un pequeño retraso (`delay`) para un efecto escalonado.
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)} // al elegir una sección, se cierra el menú
                      className="block rounded-xl px-4 py-3 text-base text-zinc-200 transition-colors hover:bg-white/5"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
                {/* Botón de WhatsApp dentro del menú móvil. */}
                <li>
                  <a
                    href={whatsappLink(MENSAJE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-base font-medium text-zinc-900"
                  >
                    <MessageCircle className="size-4" />
                    Contactar por WhatsApp
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
