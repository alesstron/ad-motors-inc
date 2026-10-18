<div align="center">

# AD Motors INC.

**Concesionario y catálogo automotriz de alta gama para Venezuela.**
Inventario en vivo, financiamiento VIP, accesorios 4x4 y atención directa por WhatsApp.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Estado](https://img.shields.io/badge/estado-frontend_completo-22c55e?style=flat-square)

</div>

---

## Resumen

AD Motors INC. es una web de catálogo para un concesionario de vehículos premium y 4x4. No tiene pasarela de pago: cada consulta, cita o solicitud de financiamiento se arma como un mensaje y se envía por **WhatsApp**. El diseño es minimalista, inspirado en Apple y Vercel, con **dark mode** como única experiencia.

| Qué es           | Detalle                                                             |
| ---------------- | ------------------------------------------------------------------- |
| Tipo de proyecto | Frontend Next.js (App Router), datos locales, sin backend           |
| Moneda           | USD, con switch global a bolívares (tipo de cambio fijo y editable) |
| Contacto         | Enlaces `api.whatsapp.com`, sin API de WhatsApp                     |
| Idioma           | Interfaz y comentarios del código en español                        |

## Características

**Inventario**

- Filtros en vivo por marca, categoría, año y rango de precio.
- Tarjetas con kilometraje, transmisión, motor, tracción y ubicación de la unidad.
- Ficha técnica en modal con galería, especificaciones y estados de unidad (`Certificado AD`, `Entrega Inmediata`, `Disponible`).
- Comparador de vehículos y garaje de favoritos.

**Financiamiento VIP**

- Calculadora dentro de cada ficha: inicial del 30 % al 70 % y plazos de 6, 12, 18, 24 y 36 meses.
- Cuota mensual estimada en USD y en bolívares, en tiempo real.
- Solicitud de pre-aprobación pre-llenando el formulario de citas, o directo por WhatsApp.

**Accesorios 4x4**

- 12 productos en 4 familias: Suspensión y Elevación, Cauchos y Rines, Parachoques y Protección, Iluminación y Winches.
- Marcas como Old Man Emu, Mickey Thompson, BFGoodrich, ARB y WARN (3 suspensiones, 3 cauchos, 3 protecciones y 1 winch), todas con foto real.
- Presupuesto en vivo: suma el vehículo elegido más los accesorios y envía la cotización por WhatsApp.

**Servicios VIP y citas**

- Atención 24/7, entrega a domicilio nacional e inspección multipunto de 8 áreas.
- Citas de test-drive, inspección o compra, sin pago; el mensaje sale armado hacia WhatsApp.

## Inventario actual

Diez unidades cargadas desde `src/data/vehicles.ts`.

| Vehículo                            | Año  | Precio USD |      Km | Ubicación             |
| ----------------------------------- | ---- | ---------: | ------: | --------------------- |
| Mercedes-Benz GLE 53 AMG            | 2023 |    230.000 |   6.740 | Baruta, Caracas       |
| Chevrolet Corvette                  | 2024 |    174.000 |   2.000 | Sucre, Caracas        |
| Toyota Sequoia TRD Pro              | 2026 |    173.000 |       0 | Valencia, Carabobo    |
| Toyota Land Cruiser Serie 79        | 2024 |    106.000 |   8.000 | El Hatillo, Caracas   |
| Toyota LC79 Doble Cabina roja       | 2026 |     90.700 |     250 | Colonia Tovar, Aragua |
| Toyota Land Cruiser LC79 Sincrónico | 2026 |     91.000 |       0 | Maracaibo, Zulia      |
| Mercedes-Benz GLE 53 AMG Coupé      | 2021 |    179.000 |  48.000 | Chacao, Caracas       |
| Toyota Hilux plata                  | 2024 |     70.000 |  10.635 | Barquisimeto, Lara    |
| Toyota Hilux negra clásica          | 2012 |     35.000 | 126.000 | Maracay, Aragua       |
| Toyota Hilux SRX gris               | 2023 |     70.000 |  46.000 | Barquisimeto, Lara    |

> **Nota sobre los datos.** Precio, año, kilometraje y ubicación los indicó AD Motors y no se verificaron de forma independiente. Motor, potencia, transmisión, descripciones y la tasa de financiamiento (12 % anual) son valores de ejemplo. Los precios de accesorios son estimaciones de referencia para el mercado todoterreno venezolano, no una cotización. Las fotos de accesorios son reales (aportadas por AD Motors); algunas muestran un modelo cercano, no el exacto.

## Stack

| Capa     | Tecnología                                                                 |
| -------- | -------------------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript                              |
| Estilos  | Tailwind CSS v4                                                            |
| UI       | framer-motion, lucide-react                                                |
| Formato  | Prettier con `prettier-plugin-tailwindcss`, ESLint                         |
| Previsto | Express + Neon (PostgreSQL) para API y base de datos, despliegue en Vercel |

## Empezar

Requisitos: Node.js 20 o superior.

```bash
git clone https://github.com/alesstron/ad-motors-inc.git
cd ad-motors-inc
npm install
npm run dev
```

La web queda en [http://localhost:3000](http://localhost:3000) (si el puerto está ocupado, Next usa el 3001).

| Comando                | Qué hace                   |
| ---------------------- | -------------------------- |
| `npm run dev`          | Servidor de desarrollo     |
| `npm run build`        | Compilación de producción  |
| `npm run start`        | Sirve la compilación       |
| `npm run lint`         | ESLint                     |
| `npm run format`       | Prettier (escribe cambios) |
| `npm run format:check` | Prettier (solo verifica)   |

## Cómo editar el contenido

No hace falta tocar componentes para cambiar el catálogo. Cada archivo de datos trae instrucciones paso a paso en su cabecera.

| Quiero cambiar…                                  | Archivo                   |
| ------------------------------------------------ | ------------------------- |
| Vehículos, precios, fotos y kilometraje          | `src/data/vehicles.ts`    |
| Accesorios, precios y sus fotos                  | `src/data/accessories.ts` |
| Marcas, categorías y rangos de filtros           | `src/data/filters.ts`     |
| WhatsApp, sedes, tasa de cambio y financiamiento | `src/data/site.ts`        |

- **Fotos de vehículos:** archivos en `public/images/vehicles/`, referenciados como `/images/vehicles/nombre.jpg`.
- **Fotos de accesorios:** archivos en `public/images/accessories/`; para usar la foto real de un producto basta reemplazar el archivo con el mismo nombre.
- **Tipo de cambio:** `USD_TO_BS` en `src/data/site.ts` es un valor fijo; no consulta tasas en vivo.

## Reglas Obligatorias de Maquetación Mobile-First

- Todas las barras de pestañas y filtros horizontales deben tener scroll táctil (`flex overflow-x-auto touch-pan-x whitespace-nowrap`).
- Las tarjetas de catálogo y productos deben organizarse verticalmente (`flex-col`) en pantallas móviles.
- Las imágenes dentro de las tarjetas deben centrarse en contenedores oscuros con `w-full max-w-full object-contain` para evitar desbordamientos laterales.
- Ningún contenedor principal debe superar el 100% del ancho del viewport (`max-w-full overflow-x-hidden`).
- Todo hijo de un grid/flex que contenga filas con scroll horizontal o `nowrap` lleva `min-w-0`; `overflow-x-hidden` solo recorta el desborde, no lo arregla.
- En este proyecto: `overflow-x-hidden` va solo en `<body>` (en `<html>` rompe el `sticky`); `SmartImage` acepta `contain` para `object-contain`; el botón flotante de WhatsApp se oculta mientras `#citas` está en pantalla.

## Estructura

```
src/
  app/          Layout, página principal y estilos globales
  components/   Navbar, Hero, VehicleGrid, VehicleModal, FinancingCalculator,
                AccessoriesSection, comparador, garaje, formulario de citas, etc.
    ui/         Piezas reutilizables (SmartImage, RangeSlider, Price, ...)
  context/      Moneda, garaje, citas y presupuesto de accesorios
  data/         Inventario, accesorios, filtros y configuración del sitio
  lib/          Formato de precios, cálculo de financiamiento, enlaces de WhatsApp
  types/        Tipos de Vehicle y Accessory
public/images/  Fotos locales de vehículos y accesorios
```

## Diseño

- Dark mode permanente: fondo `#09090b`, tarjetas de vidrio con `backdrop-blur`, bordes `white/10`.
- Accesibilidad: foco visible, objetivos táctiles de al menos 44 px, etiquetas en todos los campos y respeto de `prefers-reduced-motion`.
- Diseño mobile-first con puntos de referencia de 375, 768 y 1280 px (aún sin revisión visual en dispositivo real).
- Sin emojis: solo iconos de `lucide-react`.

## Estado y próximos pasos

- [x] Catálogo, filtros, ficha técnica, comparador y garaje
- [x] Calculadora de financiamiento en USD y Bs.
- [x] Accesorios 4x4 con presupuesto y WhatsApp
- [ ] Revisión visual en navegador y móvil
- [ ] Fotos reales de las unidades y de los accesorios
- [ ] Backend Express y base de datos Neon (`/api/vehicles`, `/api/appointments`)
- [ ] Despliegue en Vercel

## Licencia

Proyecto privado de AD Motors INC. Todos los derechos reservados.
