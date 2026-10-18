/**
 * ============================================================================
 *  src/data/accessories.ts — CATÁLOGO DE ACCESORIOS & EQUIPAMIENTO 4x4 VIP
 * ============================================================================
 *  Este archivo alimenta la sección "Accesorios 4x4" (src/components/
 *  AccessoriesSection.tsx). Aquí se definen las familias (pestañas) y cada
 *  accesorio con su precio. No hay que tocar ningún componente para cambiarlo.
 *
 *  ┌─────────────────────────────────────────────────────────────────────────┐
 *  │ CÓMO AGREGAR UN ACCESORIO                                               │
 *  │  1. Copia un bloque `{ ... },` de la lista ACCESSORIES.                 │
 *  │  2. Pégalo al final de la lista y cambia todos sus campos.              │
 *  │  3. `id` único (sin espacios); `category` debe ser una de las 4         │
 *  │     familias: 'suspension' | 'ruedas' | 'proteccion' | 'iluminacion'.   │
 *  │ CÓMO EDITAR UN PRECIO: cambia `priceUsd` (dólares, sin puntos).         │
 *  │ CÓMO ELIMINAR UNO: borra su bloque completo.                            │
 *  └─────────────────────────────────────────────────────────────────────────┘
 *
 *  FOTOS (public/images/accessories/): 12 productos, 12 fotos distintas.
 *   - Fotos REALES aportadas por AD Motors (accesoriorar): las 3 de suspensión
 *     (Old Man Emu), las 3 de cauchos, las 3 de protección (ARB) y el winch WARN.
 *     Algunas muestran un modelo cercano, no el exacto (WARN VR EVO 10; el tercer
 *     caucho es de baja resolución y su marca está por confirmar); el
 *     `imageAlt` lo indica.
 *   - Unsplash (licencia libre), NO son foto de producto: Rigid (silueta
 *     nocturna) y Baja Designs (Bronco con faros redondos en el techo).
 *   Para usar la foto exacta de un producto, reemplaza el archivo con el
 *   mismo nombre.
 *
 *  SOBRE LA HONESTIDAD DE LOS PRECIOS
 *  Todos los precios son ESTIMACIONES de ejemplo (referencia de mercado
 *  internacional + flete e instalación aproximados). No provienen de una
 *  cotización de AD Motors ni de un proveedor venezolano. Confírmalos antes
 *  de publicar. La compatibilidad real depende del modelo y año del vehículo;
 *  la web lo aclara y el asesor la confirma por WhatsApp.
 * ============================================================================
 */

import type { Accessory, AccessoryCategory } from '@/types/accessory';

/** Familias de accesorios, en el orden en que aparecen las pestañas. */
export const ACCESSORY_CATEGORIES: AccessoryCategory[] = [
  {
    id: 'suspension',
    title: 'Suspensión & Elevación',
    blurb: 'Más altura libre, mejor recorrido y control en trocha y carretera.',
  },
  {
    id: 'ruedas',
    title: 'Cauchos & Rines',
    blurb: 'Tracción y presencia: cauchos todoterreno de taco agresivo y mixto.',
  },
  {
    id: 'proteccion',
    title: 'Parachoques & Protección',
    blurb: 'Defensas metálicas y protección lateral para trocha pesada.',
  },
  {
    id: 'iluminacion',
    title: 'Iluminación & Winches',
    blurb: 'Ver de noche y salir de cualquier atasco.',
  },
];

/** TODOS los accesorios. El orden de la lista es el orden en que se muestran dentro de su familia. */
export const ACCESSORIES: Accessory[] = [
  // ── SUSPENSIÓN & ELEVACIÓN (3 productos Old Man Emu, uno por cada foto real) ──
  {
    id: 'ome-bp51',
    category: 'suspension',
    brand: 'Old Man Emu',
    name: 'Kit de suspensión BP-51 (amortiguador con reservorio)',
    description:
      'Amortiguadores bypass de alto rendimiento con resortes ajustados. Recorrido largo y control a alta velocidad en terreno abierto.',
    priceUsd: 3200,
    note: 'Kit completo',
    image: '/images/accessories/ome-bp51.jpg',
    imageAlt:
      'Amortiguadores Old Man Emu con reservorio y resortes helicoidales (foto real de producto)',
  },
  {
    id: 'ome-nitrocharger-sport',
    category: 'suspension',
    brand: 'Old Man Emu',
    name: 'Kit Nitrocharger Sport (amortiguadores + espirales)',
    description:
      'Amortiguadores de gas Nitrocharger con espirales de elevación. Más altura libre y mejor control en uso mixto de ciudad y trocha.',
    priceUsd: 1400,
    note: 'Kit completo',
    image: '/images/accessories/ome-nitrocharger-sport.jpg',
    imageAlt: 'Kit Old Man Emu con cuatro amortiguadores amarillos y cuatro espirales (foto real)',
  },
  {
    id: 'ome-nitrocharger-ballestas',
    category: 'suspension',
    brand: 'Old Man Emu',
    name: 'Kit completo con ballestas y amortiguadores Nitrocharger',
    description:
      'Ballestas reforzadas, amortiguadores Nitrocharger, bujes y abrazaderas. Pensado para pick-ups con carga y uso fuera de carretera.',
    priceUsd: 1850,
    note: 'Kit completo',
    image: '/images/accessories/ome-nitrocharger-ballestas.jpg',
    imageAlt: 'Kit Old Man Emu con ballestas, amortiguadores, bujes y abrazaderas (foto real)',
  },

  // ── CAUCHOS & RINES (3 cauchos, uno por cada foto real) ──────────────────
  {
    id: 'mt-baja-legend-mtz',
    category: 'ruedas',
    brand: 'Mickey Thompson',
    name: 'Baja Legend MTZ',
    description:
      'Caucho de taco agresivo tipo barro (mud-terrain) con flancos reforzados. Máxima tracción en barro, piedra y arena.',
    priceUsd: 2100,
    note: 'Juego de 4',
    image: '/images/accessories/mt-baja-legend-mtz.jpg',
    imageAlt: 'Caucho Mickey Thompson Baja Legend MTZ de taco agresivo sobre rin negro (foto real)',
  },
  {
    id: 'bfg-ko2',
    category: 'ruedas',
    brand: 'BFGoodrich',
    name: 'All-Terrain T/A KO2',
    description:
      'El caucho todoterreno de referencia: durabilidad, agarre en seco y mojado y resistencia a cortes en piedra.',
    priceUsd: 1900,
    note: 'Juego de 4',
    image: '/images/accessories/bfg-ko2.jpg',
    imageAlt: 'Caucho BFGoodrich All-Terrain T/A KO2 sobre rin negro (foto real de producto)',
  },
  {
    id: 'caucho-all-terrain',
    category: 'ruedas',
    brand: 'Marca por confirmar',
    name: 'Caucho All-Terrain (modelo por confirmar)',
    description:
      'Caucho todoterreno de taco mixto, equilibrado entre tracción en trocha y comodidad en asfalto. Marca y modelo exactos por confirmar.',
    priceUsd: 1700,
    note: 'Juego de 4',
    image: '/images/accessories/caucho-all-terrain.jpg',
    imageAlt:
      'Caucho todoterreno All-Terrain de taco mixto sobre rin negro (foto real, baja resolución)',
  },

  // ── PARACHOQUES & PROTECCIÓN (3 productos ARB, uno por cada foto real) ───
  {
    id: 'arb-summit',
    category: 'proteccion',
    brand: 'ARB',
    name: 'Parachoques delantero Summit Bumper',
    description:
      'Defensa de acero con soporte para winche, luces auxiliares y puntos de recuperación. Protege el frente sin perder el ángulo de ataque.',
    priceUsd: 2300,
    image: '/images/accessories/arb-summit.jpg',
    imageAlt:
      'Parachoques delantero ARB con barra tubular y huecos para faros (foto real de producto)',
  },
  {
    id: 'arb-parachoques-winche',
    category: 'proteccion',
    brand: 'ARB',
    name: 'Parachoques delantero para winche',
    description:
      'Defensa de acero con alojamiento para winche y puntos de recuperación, sin barra tubular. Perfil bajo para mantener el ángulo de ataque.',
    priceUsd: 2100,
    image: '/images/accessories/arb-parachoques-winche.jpg',
    imageAlt: 'Parachoques delantero ARB de acero con alojamiento para winche (foto real)',
  },
  {
    id: 'arb-rock-sliders',
    category: 'proteccion',
    brand: 'ARB',
    name: 'Protectores laterales (rock sliders)',
    description:
      'Estribos de acero reforzado que protegen los umbrales y la carrocería de rocas y golpes laterales en trocha.',
    priceUsd: 980,
    note: 'Par',
    image: '/images/accessories/arb-rock-sliders.jpg',
    imageAlt: 'Par de protectores laterales ARB de acero negro con logotipo (foto real)',
  },

  // ── ILUMINACIÓN & WINCHES ────────────────────────────────────────────────
  {
    id: 'rigid-led',
    category: 'iluminacion',
    brand: 'Rigid Industries',
    name: 'Barra LED Adapt 50"',
    description:
      'Barra LED de alto lumen con haz combinado (flood + spot). Resistente al agua, al polvo y a las vibraciones.',
    priceUsd: 780,
    image: '/images/accessories/rigid-adapt-50.jpg',
    imageAlt: 'Silueta de un 4x4 bajo el cielo nocturno estrellado',
  },
  {
    id: 'baja-designs',
    category: 'iluminacion',
    brand: 'Baja Designs',
    name: 'Faros auxiliares LP9 Pro',
    description:
      'Par de faros auxiliares LED de iluminación precisa y larga distancia, con tecnología desarrollada en carreras off-road.',
    priceUsd: 1150,
    note: 'Par',
    image: '/images/accessories/baja-lp9-pro.jpg',
    imageAlt:
      'Ford Bronco con cinco faros auxiliares LED redondos en el techo (foto referencial de Unsplash)',
  },
  {
    id: 'warn-vr-evo',
    category: 'iluminacion',
    brand: 'WARN',
    name: 'Winch VR EVO 12-S cuerda sintética',
    description:
      'Winche eléctrico de alta resistencia con cable sintético y control remoto inalámbrico. Capacidad para recuperar vehículos pesados.',
    priceUsd: 1250,
    image: '/images/accessories/warn-vr-evo-12s.jpg',
    imageAlt:
      'Winch WARN serie VR EVO con cuerda de arrastre (foto real; la imagen muestra el VR EVO 10)',
  },
];
