/**
 * ============================================================================
 *  src/data/vehicles.ts — BASE DE DATOS LOCAL DE AD MOTORS INC.
 * ============================================================================
 *  Este es el ÚNICO archivo que necesitas tocar para cambiar el inventario.
 *  La página lee la lista `VEHICLES` de abajo y dibuja todo automáticamente:
 *  tarjetas, filtros, fichas técnicas y galerías. No hay que editar ningún
 *  componente para agregar, quitar o modificar un vehículo.
 *
 *  ┌─────────────────────────────────────────────────────────────────────────┐
 *  │ CÓMO AGREGAR UN VEHÍCULO                                                │
 *  │  1. Copia un bloque completo, desde su "{" hasta su "}," (incluida la   │
 *  │     coma final).                                                        │
 *  │  2. Pégalo dentro de `VEHICLES`, antes del "];" del final.              │
 *  │  3. Cambia TODOS los campos. El `id` debe ser único (sin espacios ni    │
 *  │     acentos), por ejemplo: 'toyota-land-cruiser-2024'.                  │
 *  │  4. Guarda. El auto aparece solo, y sus filtros también.                │
 *  │  Si la marca o la categoría es nueva, agrégala también en               │
 *  │  src/types/vehicle.ts y src/data/filters.ts.                            │
 *  └─────────────────────────────────────────────────────────────────────────┘
 *  ┌─────────────────────────────────────────────────────────────────────────┐
 *  │ CÓMO EDITAR UN PRECIO                                                   │
 *  │  Busca el vehículo por su nombre y cambia el número de `price`.         │
 *  │  Se escribe en dólares, SIN puntos, comas ni símbolo: 28500 (no         │
 *  │  "$28.500"). La página lo muestra con formato: $28.500.                 │
 *  │  Actualiza también `priceBasis` para ser honesto con el origen:         │
 *  │   'cliente' | 'referencia' (+ `priceSource`) | 'estimado'.              │
 *  └─────────────────────────────────────────────────────────────────────────┘
 *  ┌─────────────────────────────────────────────────────────────────────────┐
 *  │ CÓMO CAMBIAR, AGREGAR O QUITAR FOTOS                                    │
 *  │  Cada vehículo tiene `images: [ ... ]`, una lista de enlaces directos.  │
 *  │   • La PRIMERA foto es la portada de la tarjeta.                        │
 *  │   • Todas juntas forman la galería de la ficha técnica.                 │
 *  │   • Para agregar una foto: añade una línea nueva con su enlace          │
 *  │     entre comillas y una coma al final.                                 │
 *  │   • Para quitarla: borra su línea completa. Deja al menos UNA.          │
 *  │  Cada foto puede ser de DOS tipos:                                      │
 *  │   • LOCAL: guarda el archivo en public/images/vehicles/ y escribe       │
 *  │     '/images/vehicles/nombre.jpg' (sin "public"). Es lo más fiable.     │
 *  │   • ENLACE: https://images.unsplash.com/... (otros sitios: agrega su    │
 *  │     dominio en `images.remotePatterns` de next.config.ts).              │
 *  │  Consejo: deja "w=1200&q=60" al final de los enlaces de Unsplash;       │
 *  │  fotos más pesadas cargan lento y pueden fallar.                        │
 *  └─────────────────────────────────────────────────────────────────────────┘
 *  ┌─────────────────────────────────────────────────────────────────────────┐
 *  │ CÓMO ELIMINAR UN VEHÍCULO                                               │
 *  │  Borra su bloque completo, desde "{" hasta "},". O, si solo quieres     │
 *  │  ocultarlo por un tiempo, ponle "//" delante a cada línea del bloque.   │
 *  └─────────────────────────────────────────────────────────────────────────┘
 *
 *  SOBRE LA HONESTIDAD DE LOS DATOS
 *  - Precio, kilometraje, año y ubicación de las 10 unidades los indicó AD
 *    Motors (`priceBasis: 'cliente'`); no se verificaron de forma independiente.
 *  - Motor, potencia, transmisión, combustible y descripciones son DE EJEMPLO
 *    (datos típicos del modelo, no de cada unidad). Confírmalos antes de publicar.
 *  - Fotos: capturas recortadas guardadas en public/images/vehicles/. El Hilux 2012
 *    (negro) usa una foto de un Hilux beige de generación similar: reemplázala
 *    por la foto de la unidad real.
 * ============================================================================
 */

import type { Vehicle } from '@/types/vehicle';

/**
 * Áreas que revisa la "Inspección multipunto". Aparece como lista de
 * verificación en la ficha técnica. Edita, agrega o quita líneas libremente.
 */
export const INSPECTION_POINTS: string[] = [
  'Motor y sistema de refrigeración',
  'Transmisión y diferenciales',
  'Frenos y suspensión',
  'Carrocería, pintura y chasis',
  'Interior y electrónica',
  'Neumáticos y alineación',
  'Historial y documentación',
  'Prueba de manejo en ruta',
];

/**
 * INVENTARIO COMPLETO (10 unidades). Cada bloque `{ ... }` es un vehículo.
 * El orden de la lista es el orden en la cuadrícula (si no hay filtros).
 */
export const VEHICLES: Vehicle[] = [
  // 1) MERCEDES-BENZ GLE 53 AMG 4MATIC+ 2023 — datos indicados por AD Motors
  {
    id: 'mercedes-gle53-amg-2023',
    brand: 'Mercedes-Benz',
    model: 'GLE 53 AMG',
    trim: '4MATIC+',
    year: 2023,
    category: 'SUV 4x4',
    price: 230000,
    priceBasis: 'cliente',
    status: 'Certificado AD',
    location: 'Baruta, Caracas',
    mileage: 6740,
    transmission: 'Automática 9G-TRONIC',
    engine: '3.0L I6 biturbo EQ Boost',
    power: '429 hp',
    drivetrain: 'AWD 4MATIC+',
    fourByFour: true,
    fuel: 'Gasolina (híbrido suave)',
    color: 'Por confirmar',
    description:
      'SUV deportiva de alto desempeño con suspensión neumática AIRMATIC y asientos de cuero. Muy bajo kilometraje.',
    highlights: ['Suspensión AIRMATIC', 'Interior de cuero', 'Sistema MBUX', 'Techo panorámico'],
    images: ['/images/vehicles/mercedes-gle53-amg-2023.jpg'],
  },
  // 2) CHEVROLET CORVETTE STINGRAY 2024 — datos indicados por AD Motors
  {
    id: 'chevrolet-corvette-2024',
    brand: 'Chevrolet',
    model: 'Corvette',
    trim: 'Stingray',
    year: 2024,
    category: 'Deportivo',
    price: 174000,
    priceBasis: 'cliente',
    status: 'Entrega Inmediata',
    location: 'Sucre, Caracas',
    mileage: 2000,
    transmission: 'Automática 8 vel. doble embrague',
    engine: '6.2L V8 LT2',
    power: '495 hp',
    drivetrain: 'Tracción trasera',
    fourByFour: false,
    fuel: 'Gasolina',
    color: 'Por confirmar',
    description:
      'Deportivo de motor central con diseño de última generación. Unidad prácticamente nueva, 2.000 km.',
    highlights: ['Motor central V8', 'Modos de manejo', 'Techo removible', 'Cámara frontal'],
    images: ['/images/vehicles/chevrolet-corvette-2024.jpg'],
  },
  // 3) TOYOTA SEQUOIA TRD PRO 2026 — datos indicados por AD Motors
  {
    id: 'toyota-sequoia-trd-pro-2026',
    brand: 'Toyota',
    model: 'Sequoia',
    trim: 'TRD Pro',
    year: 2026,
    category: 'SUV 4x4',
    price: 173000,
    priceBasis: 'cliente',
    status: 'Entrega Inmediata',
    location: 'Valencia, Carabobo',
    mileage: 0,
    transmission: 'Automática 10 vel.',
    engine: '3.5L V6 biturbo i-FORCE MAX híbrido',
    power: '437 hp',
    drivetrain: '4x4 con reductora',
    fourByFour: true,
    fuel: 'Híbrido',
    color: 'Por confirmar',
    description:
      'Gran SUV de siete plazas en versión TRD Pro: suspensión FOX, tracción 4x4 con reductora y potencia híbrida. 0 km.',
    highlights: ['Suspensión FOX', 'Versión TRD Pro', 'Híbrido i-FORCE MAX', 'Hasta 7 plazas'],
    images: ['/images/vehicles/toyota-sequoia-trd-pro-2026.jpg'],
  },
  // 4) TOYOTA LAND CRUISER SERIE 79 2024 — datos indicados por AD Motors
  {
    id: 'toyota-land-cruiser-79-2024',
    brand: 'Toyota',
    model: 'Land Cruiser',
    trim: 'Serie 79',
    year: 2024,
    category: 'Pick-Up',
    price: 106000,
    priceBasis: 'cliente',
    status: 'Certificado AD',
    location: 'El Hatillo, Caracas',
    mileage: 8000,
    transmission: 'Manual 5 vel.',
    engine: '4.5L V8 turbodiésel',
    power: '202 hp',
    drivetrain: '4x4 con bloqueos',
    fourByFour: true,
    fuel: 'Diésel',
    color: 'Por confirmar',
    description:
      'El legendario Serie 79: chasis de largueros, ejes rígidos y capacidad todoterreno de expedición.',
    highlights: [
      'Ejes rígidos',
      'Bloqueos de diferencial',
      'Motor V8 diésel',
      'Chasis de largueros',
    ],
    images: ['/images/vehicles/toyota-land-cruiser-79-2024.jpg'],
  },
  // 5) TOYOTA LAND CRUISER LC79 DOBLE CABINA 2026 — datos indicados por AD Motors
  {
    id: 'toyota-land-cruiser-79-doble-cabina-2026',
    brand: 'Toyota',
    model: 'Land Cruiser',
    trim: 'LC79 Doble Cabina',
    year: 2026,
    category: 'Pick-Up',
    price: 90700,
    priceBasis: 'cliente',
    status: 'Entrega Inmediata',
    location: 'Colonia Tovar, Aragua',
    mileage: 250,
    transmission: 'Manual 5 vel.',
    engine: '4.5L V8 turbodiésel',
    power: '202 hp',
    drivetrain: '4x4 con bloqueos',
    fourByFour: true,
    fuel: 'Diésel',
    color: 'Rojo',
    description:
      'LC79 doble cabina en rojo, con cinco plazas y la robustez del Serie 79. Casi nueva, 250 km.',
    highlights: ['Doble cabina', 'Cinco plazas', 'Motor V8 diésel', 'Color rojo'],
    images: ['/images/vehicles/toyota-land-cruiser-79-rojo.jpg'],
  },
  // 6) TOYOTA LAND CRUISER LC79 SINCRÓNICO 2026 — datos indicados por AD Motors
  {
    id: 'toyota-land-cruiser-79-sincronico-2026',
    brand: 'Toyota',
    model: 'Land Cruiser',
    trim: 'LC79 Sincrónico',
    year: 2026,
    category: 'Pick-Up',
    price: 91000,
    priceBasis: 'cliente',
    status: 'Entrega Inmediata',
    location: 'Maracaibo, Zulia',
    mileage: 0,
    transmission: 'Manual sincronizada 5 vel.',
    engine: '4.5L V8 turbodiésel',
    power: '202 hp',
    drivetrain: '4x4 con bloqueos',
    fourByFour: true,
    fuel: 'Diésel',
    color: 'Por confirmar',
    description:
      'LC79 con caja sincrónica, 0 km: la configuración clásica para trabajo duro y expedición.',
    highlights: ['Caja sincrónica', '0 km', 'Ejes rígidos', 'Motor V8 diésel'],
    images: ['/images/vehicles/toyota-land-cruiser-79-sincronico-2026.jpg'],
  },
  // 7) MERCEDES-BENZ GLE 53 AMG COUPÉ 4MATIC+ 2021 — datos indicados por AD Motors
  {
    id: 'mercedes-gle53-amg-coupe-2021',
    brand: 'Mercedes-Benz',
    model: 'GLE 53 AMG',
    trim: 'Coupé 4MATIC+',
    year: 2021,
    category: 'SUV 4x4',
    price: 179000,
    priceBasis: 'cliente',
    status: 'Disponible',
    location: 'Chacao, Caracas',
    mileage: 48000,
    transmission: 'Automática 9G-TRONIC',
    engine: '3.0L I6 biturbo EQ Boost',
    power: '429 hp',
    drivetrain: 'AWD 4MATIC+',
    fourByFour: true,
    fuel: 'Gasolina (híbrido suave)',
    color: 'Por confirmar',
    description:
      'SUV Coupé con línea deportiva, motor de seis cilindros en línea y tracción integral AMG.',
    highlights: ['Carrocería Coupé', 'Suspensión AIRMATIC', 'Interior de cuero', 'Sistema MBUX'],
    images: ['/images/vehicles/mercedes-gle53-amg-2021.jpg'],
  },
  // 8) TOYOTA HILUX 4X4 DOBLE CABINA 2024 — datos indicados por AD Motors
  {
    id: 'toyota-hilux-2024-plata',
    brand: 'Toyota',
    model: 'Hilux',
    trim: '4x4 Doble Cabina',
    year: 2024,
    category: 'Pick-Up',
    price: 70000,
    priceBasis: 'cliente',
    status: 'Certificado AD',
    location: 'Barquisimeto, Lara',
    mileage: 10635,
    transmission: 'Automática 6 vel.',
    engine: '2.8L turbodiésel',
    power: '201 hp',
    drivetrain: '4x4 con reductora',
    fourByFour: true,
    fuel: 'Diésel',
    color: 'Plata',
    description:
      'Hilux 2024 en plata con bajo kilometraje: pick-up versátil para ciudad, carga y trocha.',
    highlights: ['Doble cabina', '4x4 con reductora', 'Bajo kilometraje', 'Color plata'],
    images: ['/images/vehicles/toyota-hilux-2024.jpg'],
  },
  // 9) TOYOTA HILUX CLÁSICA DOBLE CABINA 2012 — datos indicados por AD Motors
  {
    id: 'toyota-hilux-2012-negra',
    brand: 'Toyota',
    model: 'Hilux',
    trim: 'Clásica Doble Cabina',
    year: 2012,
    category: 'Pick-Up',
    price: 35000,
    priceBasis: 'cliente',
    status: 'Disponible',
    location: 'Maracay, Aragua',
    mileage: 126000,
    transmission: 'Manual 5 vel.',
    engine: 'Por confirmar',
    power: 'Por confirmar',
    drivetrain: '4x4',
    fourByFour: true,
    fuel: 'Gasolina',
    color: 'Negro',
    description:
      'Hilux de la generación clásica, apreciada por su durabilidad y repuestos disponibles.',
    highlights: ['Generación clásica', 'Doble cabina', 'Mecánica probada', 'Color negro'],
    images: ['/images/vehicles/toyota-hilux-kavak-2008.jpg'],
  },
  // 10) TOYOTA HILUX SRX 4X4 2023 — datos indicados por AD Motors
  {
    id: 'toyota-hilux-srx-2023',
    brand: 'Toyota',
    model: 'Hilux',
    trim: 'SRX 4x4',
    year: 2023,
    category: 'Pick-Up',
    price: 70000,
    priceBasis: 'cliente',
    status: 'Certificado AD',
    location: 'Barquisimeto, Lara',
    mileage: 46000,
    transmission: 'Automática 6 vel.',
    engine: '2.8L turbodiésel',
    power: '201 hp',
    drivetrain: '4x4 con reductora',
    fourByFour: true,
    fuel: 'Diésel',
    color: 'Gris',
    description:
      'Hilux SRX 2023 en gris: versión equipada con tracción 4x4 y acabado interior superior.',
    highlights: ['Versión SRX', '4x4 con reductora', 'Pantalla multimedia', 'Color gris'],
    images: ['/images/vehicles/toyota-hilux-srx-2023.jpg'],
  },
];
