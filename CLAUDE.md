# CLAUDE.md — Memoria permanente del proyecto

> Este archivo se carga al inicio de cada sesión. Mantenlo corto, veraz y actualizado.
> Lo marcado con `[PENDIENTE]` aún no está definido: confirmar con el usuario antes de asumirlo.

## 1. Resumen del proyecto

- **Nombre:** **AD Motors INC.** (paquete npm `ad-motors`; carpeta `proyecto 2`). Antes fue un catálogo inmobiliario ("Luxe Estates"), reemplazado el 2026-10-18.
- **Descripción:** concesionario y catálogo automotriz de alta gama para Venezuela (precios en USD, con switch a Bs.). Filtros en vivo, ficha técnica en modal con calculadora de financiamiento, comparador, garaje, accesorios 4x4 con presupuesto, servicios Concierge VIP y citas **sin pasarela de pago** (se envían por WhatsApp).
- **Estado (2026-10-18):** frontend completo y comentado; inventario local (10 unidades); backend/BD sin crear. Repo git en rama `main` (1 commit `8b412e8`), subido a https://github.com/alesstron/ad-motors-inc.git el 2026-10-18.
- **Idioma:** comunicación, UI y **comentarios del código en español** (didácticos, pensados para que alguien no técnico pueda editar). Identificadores en inglés; datos de dominio (`Certificado AD`) en español.
- **Puerto de desarrollo:** `npm run dev` usa el 3000; si está ocupado, Next usa el 3001. Este proyecto corre en **http://localhost:3000** (el servidor Next de esta carpeta ya estaba activo; revisar con `netstat`/`Get-NetTCPConnection` antes de lanzar otro). El 2026-10-18 el usuario autorizó cerrar el Express de otro proyecto suyo ("Rumbo Nómada", `node server/src/index.js`); si lo reinicia mientras este corre, Next saltará al 3001. **No cerrar procesos ajenos sin permiso explícito.**
- **Seguridad:** `.gitignore` ignora `.env`, `.env.*`, `.env*.local` (excepto `.env.example`), `node_modules/`, `.next/`, `*.log`, carpetas de credenciales (`credentials/`, `secrets/`, `.aws/`, `.ssh/`…), llaves (`*.pem`, `*.key`…), `.vercel` y `.claude/settings.local.json`. Probado en un repo temporal. No hay secretos en el proyecto; el repo ya está en GitHub, así que no commitear secretos.
- **Memoria de la máquina:** poca RAM/memoria virtual. `tsc`/`eslint`/`next build` pueden morir con `FATAL ERROR: Zone Allocation failed` aunque el heap sea pequeño; es el sistema, no el código. Reintentar, correr `eslint` por archivo/carpeta (`src/data`, un componente) o parar el dev server propio antes.

### Stack tecnológico

| Capa          | Tecnología                                        | Notas                                                                                                                                                                       |
| ------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend      | **Next.js 16** (App Router, TypeScript, React 19) | **Decidido** (no Vite). Antes de escribir código Next, leer `node_modules/next/dist/docs/` (ver `AGENTS.md`); `next.config.ts` usa `cacheComponents` y `partialPrefetching` |
| Estilos       | **Tailwind CSS v4**                               | Dark mode permanente (sin toggle), tokens en `src/app/globals.css`                                                                                                          |
| UI            | `framer-motion`, `lucide-react`                   | Animaciones e iconos                                                                                                                                                        |
| Backend       | **Express** (Node.js)                             | API REST bajo `/api/*` — `[PENDIENTE]` aún no existe                                                                                                                        |
| Base de datos | **Neon** (PostgreSQL serverless)                  | `DATABASE_URL` — `[PENDIENTE]`                                                                                                                                              |
| Despliegue    | **Vercel**                                        | Variables de entorno en el panel de Vercel                                                                                                                                  |
| Formato       | **Prettier** + `prettier-plugin-tailwindcss`      | Obligatorio antes de cada commit                                                                                                                                            |

### Variables de entorno (nombres; nunca guardar valores aquí)

- `DATABASE_URL` — Neon · `WHATSAPP_*` — `[PENDIENTE]` · `SEED_SECRET` — `[PENDIENTE]` (proteger `/api/seed`).
- Los secretos van en `.env.local` (ignorado por git) y en Vercel. **Nunca** commitearlos ni escribirlos aquí.

## 2. Reglas de diseño

### Estilo Apple / Dark Mode

- Minimalista tipo Apple/Vercel; **dark mode** como única experiencia: fondo `#09090b`, texto `zinc-50/300/500`.
- Geist + stack de sistema, pesos 400/500/600, `tracking-tight` en títulos, `tracking-wider uppercase text-[11px]` en badges.
- Esquinas `rounded-2xl`/`3xl`, bordes `border-white/10`, vidrio `backdrop-blur-xl`, resplandores ambientales difusos en secciones principales.
- Animaciones breves; respetar `prefers-reduced-motion` (global en `globals.css`). Un solo acento (índigo en foco).

### Impeccable UI

- Consistencia (escala 4/8 px, radios, estados). Todo interactivo: hover, `focus-visible`, active, disabled, loading, error.
- Accesibilidad AA, objetivos táctiles ≥ 44 px (`min-h-11`/`12`), etiquetas en inputs, teclado completo.
- Mobile-first (375 / 768 / 1280). Estados vacíos, skeletons y errores siempre diseñados. **Cero emojis**; solo `lucide-react`.
- Reutilizar componentes; no duplicar estilos.

### Prettier

- `npm run format` antes de terminar una tarea; `npm run format:check` para verificar. `.prettierrc`: `semi`, `singleQuote`, `trailingComma: "all"`, `printWidth: 100`, plugin de Tailwind.

### Sistema visual (mantener en componentes nuevos)

- Tarjeta glass: `bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-2xl`; hover `hover:-translate-y-1 hover:border-white/20 transition-all duration-300`.
- `.text-metal` (degradado metálico) y `.range` (slider doble) en `globals.css`. Imágenes siempre con `SmartImage` (skeleton + fallback). Foco: `focus-visible:ring-2 focus-visible:ring-indigo-400/70`.

### Regla de comentarios (obligatoria en código nuevo o modificado)

Cada archivo empieza con un bloque de cabecera en español (qué hace + cómo modificarlo). Comentar encima de cada componente, función, `useState`/`useEffect` y sección de JSX/Tailwind relevante, con tono didáctico. Los datos editables (`src/data/*`) llevan instrucciones paso a paso.

## 3. Arquitectura, rutas y configuración

### Estructura (todo bajo `src/`, alias `@/*` → `./src/*`)

```
src/
  app/        layout.tsx (HTML base, fuentes, metadata) · page.tsx (orden de secciones) · globals.css
  components/ Navbar · Hero · VehicleGrid · VehicleCard · VehicleModal · FinancingCalculator · AccessoriesSection
              CompareBar · CompareModal · GarageDrawer · CurrencySwitch · Lightbox · Providers
              AppointmentForm · ServicesVIP · Locations · FloatingWhatsApp · Footer
    ui/       SmartImage · RangeSlider · SelectField · StatusBadge · Price · VehicleActions   (piezas reutilizables)
  context/    BookingContext (ficha → formulario, scroll a #citas) · CurrencyContext (USD/Bs.) · GarageContext · LeadContext (ciudad, accesorios y vehículo a equipar)
  data/       vehicles.ts (INVENTARIO + INSPECTION_POINTS) · accessories.ts (familias + 12 accesorios) · filters.ts (marcas, categorías, rangos) · site.ts (WhatsApp, sedes, estados, FINANCING, USD_TO_BS)
  lib/        format.ts ($28.500, Bs., km) · whatsapp.ts (whatsappLink) · finance.ts (calcFinancing) · leads.ts (mensajes WhatsApp) · localStore.ts · scroll.ts
  types/      vehicle.ts (`Vehicle`, `Brand`, `Category`, `Status`, `PriceBasis`) · accessory.ts (`Accessory`, `AccessoryCategory`)
public/images/  vehicles/ (fotos locales de los 10 autos) · accessories/ (12 fotos de accesorios)
```

- Flujo: `page.tsx` → `Providers` → Navbar, `main` = `VehicleGrid` (filtros + Hero + tarjetas + `VehicleModal` con `FinancingCalculator`) → `AccessoriesSection` → ServicesVIP → AppointmentForm → Locations; luego Footer, FloatingWhatsApp, CompareBar, GarageDrawer.
- **Para editar el inventario solo se toca `src/data/vehicles.ts`** (instrucciones de agregar/editar/eliminar vehículos, fotos y precios están en su cabecera). Marca o categoría nueva → también `src/types/vehicle.ts` y `src/data/filters.ts` (los filtros solo listan Toyota, Chevrolet y Mercedes-Benz; categorías SUV 4x4, Pick-Up y Deportivo; `YEAR_MIN` 2012, `PRICE_MAX` 250.000: ajustarlos si entra un auto fuera de rango, o queda oculto por defecto).
- `images` de cada vehículo son **rutas locales** `/images/vehicles/x.jpg` (la 1.ª = portada); también valen URLs https de `images.unsplash.com` (otros dominios → `images.remotePatterns` en `next.config.ts`; mantener `w=1200&q=60`: con tamaños mayores el origen tarda ~14 s y Next da 504).
- Anclas: `#inicio`, `#inventario`, `#accesorios`, `#servicios`, `#citas`, `#sedes`.

### Endpoints clave (API Express, prefijo `/api`) — `[PENDIENTE]`, ninguno existe aún

| Método       | Ruta                    | Propósito                                                              |
| ------------ | ----------------------- | ---------------------------------------------------------------------- |
| `GET`/`POST` | `/api/seed`             | Poblar Neon con inventario y sedes (idempotente). Proteger con secreto |
| `GET`        | `/api/vehicles`         | Inventario (reemplazaría a `src/data/vehicles.ts`)                     |
| `POST`       | `/api/appointments`     | Guardar citas (hoy solo se envían por WhatsApp)                        |
| `GET`/`POST` | `/api/whatsapp/webhook` | Verificación y recepción de mensajes                                   |
| `GET`        | `/api/health`           | Chequeo de salud                                                       |

### WhatsApp

- Solo enlaces `wa.me` (sin API). Número: `04245535901` → `https://wa.me/584245535901`, definido **una vez** en `src/data/site.ts`; todos los botones pasan por `whatsappLink()` (`src/lib/whatsapp.ts`). Botón flotante verde fijo.
- Backend/webhook: proveedor `[PENDIENTE]`; plantillas aprobadas `[PENDIENTE]`.

### Sedes (`src/data/site.ts` → `SEDES`)

- **Principal:** Avenida Pedro León Torres, Barquisimeto, Estado Lara. **Internacionales:** Ciudad de México y Madrid, **sin dirección** (no se inventó; "Atención con cita previa") — `[PENDIENTE]` si el usuario las da. Sin horarios por sede: servicio "24/7" por WhatsApp.

### Servicios VIP (`#servicios`) y Citas (`#citas`)

- VIP: atención 24 h / 7 días · entrega a domicilio nacional · inspección multipunto (8 áreas en `INSPECTION_POINTS`).
- Citas: sin pago. Tipos: test-drive a domicilio, inspección multipunto, compra con entrega. Campos: vehículo (preseleccionable desde la ficha), nombre, teléfono, estado (24), ciudad/zona, fecha (no pasada), horario, notas. Al enviar abre WhatsApp con el mensaje armado; **nada se guarda**.

### Financiamiento y accesorios 4x4

- **Calculadora** (`FinancingCalculator.tsx`, dentro de la ficha): inicial 30–70 % (paso 5) y plazo 6/12/18/24/36 meses (slider discreto, no mes a mes); cuota en USD y Bs.; botones "Solicitar Pre-Aprobación" (pre-llena el formulario de citas) y WhatsApp. Parámetros en `FINANCING` (`site.ts`): **tasa 12 % anual es un valor de ejemplo**, no una oferta de AD Motors. Cálculo en `src/lib/finance.ts`.
- **Bs.:** `USD_TO_BS = 881.07` (fecha 18/10/2026) es un valor **fijo** en `site.ts`; no hay tasa en vivo. Actualizarlo a mano.
- **Accesorios** (`#accesorios`, `src/data/accessories.ts`): 4 pestañas (Suspensión & Elevación, **Cauchos**, Parachoques & Protección, Iluminación & Winches), **10 productos, 10 fotos reales distintas**. REGLA del usuario: accesorio sin foto real se omite. Suspensión = 3 Old Man Emu (BP-51 $3.200, Nitrocharger Sport $1.900, kit con ballestas $2.200); Cauchos (precio del **juego de 4**) = Mickey Thompson Baja Legend MTZ $1.400, BFGoodrich KO2 $1.200, All-Terrain marca por confirmar $900; Protección = ARB Summit $2.300, ARB parachoques para winche $2.100, ARB rock sliders $980; Iluminación = solo WARN VR EVO 12-S $1.250. Botón Añadir/Añadido → panel "Tu presupuesto" suma vehículo (solo SUV 4x4 y Pick-Up) + accesorios y envía la cotización por WhatsApp (estado en `LeadContext`). **Precios: estimaciones de referencia para Venezuela** (rangos dados por el usuario: cauchos $200-350 c/u, suspensión $1.800-3.500, parachoques ARB $1.500-2.500, winches $900-1.400; rock sliders $980 fuera de esos rangos, lo puse yo).
- **Fotos de accesorios** (`public/images/accessories/`, 4:3, fondo blanco recortado): las 10 son reales, aportadas por el usuario (`accesoriorar.rar`, fuera del repo, `*.rar` ignorado, sigue en la raíz local). La del winch es el **VR EVO 10** (el ítem dice 12-S). La del tercer caucho es de **225 px y su marca no se lee** ("…Terrain T/A"): "Marca por confirmar", se mantiene por orden del usuario. Rigid y Baja Designs se **eliminaron** (solo tenían fotos de Unsplash, no de producto); restaurables con `git show 0c0cf1e:src/data/accessories.ts` y los jpg de ese commit. Los `imageAlt` lo indican. Para foto real: reemplazar el archivo con el mismo nombre.
- Del `.rar` (15 fotos) se usan 10 y quedan **5 sin usar**: ARB Deluxe (defensa tubular sin luces), defensa trasera, portaequipaje, winch sin marca y faros ARB Solis. No hay ninguna foto de rin.

### Origen de datos del inventario (IMPORTANTE, no presentar como real sin confirmar)

- Inventario actual (**10**, definido por el usuario el 2026-10-18; `priceBasis: 'cliente'`, **no verificado** contra mercado): GLE 53 AMG 2023 $230.000 · 6.740 km · Baruta; Corvette 2024 $174.000 · 2.000 km · Sucre; Sequoia TRD Pro 2026 $173.000 · 0 km · Valencia; Land Cruiser 79 2024 $106.000 · 8.000 km · El Hatillo; LC79 Doble Cabina roja 2026 $90.700 · 250 km · Colonia Tovar; LC79 Sincrónico 2026 $91.000 · 0 km · Maracaibo; GLE 53 AMG Coupé 2021 $179.000 · 48.000 km · Chacao; Hilux 2024 plata $70.000 · 10.635 km · Barquisimeto; Hilux 2012 negra $35.000 · 126.000 km · Maracay; Hilux SRX 2023 gris $70.000 · 46.000 km · Barquisimeto. Cada vehículo tiene `location`.
- **Ilustrativos (los puse yo, confirmar):** motor, potencia, transmisión, combustible, colores no dictados ("Por confirmar"), descripciones y highlights; categoría (GLE y Sequoia = SUV 4x4; LC79 e Hilux = Pick-Up; Corvette = Deportivo) y estado (Certificado AD / Entrega Inmediata / Disponible). Motor y potencia del Hilux 2012 quedaron "Por confirmar".
- Fotos: capturas locales en `public/images/vehicles/` (22 archivos; solo 10 en uso, el resto sin asignar: Tahoe, LX600/LX700h, G63, Cayenne, Mustang, Yaris, FJ Cruiser, etc.). `fotos_carros.zip` **nunca apareció** en la máquina; no se sabe si esas fotos salieron de él ni si ya estaban recortadas. El **Hilux 2012 "negra" usa la foto de un Hilux beige** (`toyota-hilux-kavak-2008.jpg`): reemplazar por la unidad real.
- Los datos del inventario anterior (16 unidades con Unsplash, referencias Toyota/Ford VE) se descartaron el 2026-10-18.

### Convenciones de despliegue (Vercel)

- Un proyecto Vercel; backend Express como funciones serverless bajo `/api` (o servicio aparte: `[PENDIENTE]`). Driver `@neondatabase/serverless`.

## 4. Protocolo de memoria (obligatorio para Claude)

**Al final de cada sesión relevante** (cambios de código, arquitectura, endpoints, configuración, bugs importantes), actualizar este archivo **sin que el usuario lo pida**:

1. Añadir entrada al **Registro de progreso** con fecha `AAAA-MM-DD`, qué se hizo y qué queda pendiente.
2. Actualizar las secciones 1–3 si cambió stack, endpoints, sedes, WhatsApp, datos o reglas; reemplazar los `[PENDIENTE]` resueltos.
3. Registrar decisiones y su motivo; eliminar lo obsoleto (no acumular).
4. No guardar secretos, tokens ni datos personales.
5. Terminar la sesión indicando brevemente qué se actualizó.

No actualizar por sesiones triviales (preguntas puntuales, cambios cosméticos mínimos).

## 5. Registro de progreso

### 2026-10-18 — Sesiones 1–2: memoria inicial y catálogo inmobiliario (reemplazado)

- Creado este archivo; inicializado Next.js 16 + Tailwind v4 + Prettier + framer-motion + lucide-react (scaffold en carpeta temporal y copiado: "proyecto 2" no es nombre npm válido). Se construyó "Luxe Estates", luego sustituido por AD Motors.

### 2026-10-18 — Sesiones 3–5 (resumen): AD Motors, refactor y seguridad

- Pasó de inmobiliaria a concesionario; todo bajo `src/` (alias `@/*`), datos separados en `src/data` y `src/types`, cabeceras didácticas en español en cada archivo. `.gitignore` reescrito y probado (ver sección 1). Incidencia conocida: lint rechaza `setState` en `useEffect` → se usó `useSyncExternalStore` para la fecha mínima del formulario.

### 2026-10-18 — Sesión 6: inventario de 10, calculadora, accesorios con fotos

- Entre sesiones (sin registrar antes) aparecieron: comparador, garaje, switch USD/Bs., lightbox, `LeadContext`, `AccessoriesSection`, `FinanceCalculator` y 22 fotos locales de autos.
- `FinanceCalculator` renombrado a `FinancingCalculator` (ya cumplía lo pedido; no se duplicó). Inventario reemplazado por los 10 autos del usuario (campo nuevo `location` en `Vehicle`, mostrado en la ficha); filtros reducidos a las marcas/categorías presentes, `YEAR_MIN` 2012 y `PRICE_MAX` 250.000 (el GLE de $230.000 quedaba fuera del slider).
- Accesorios: nombres ajustados a lo pedido, añadido ARB Skid Plate (reemplazó los dos bumpers "a medida"), campo `image`/`imageAlt`, tarjetas con foto y nota de fotos referenciales (detalle en sección 3).
- Verificado: `tsc` limpio; `eslint` limpio por archivos tocados (el global muere por memoria); `http://localhost:3000` 200 y las 12 fotos de accesorios 200 por el optimizador. `next build` **no** se corrió; **no** se revisó visualmente en navegador ni en móvil.
- Los mensajes del usuario llegaron cortados varias veces (la 1.ª entrega y la PARTE 2 vacía): ante un mensaje truncado, pedir el texto completo en vez de suponer.
- **Siguiente (sesión 6):** que el usuario revise visualmente y dé fotos reales (accesorios y Hilux 2012); validar precios, kms, specs y tasa de financiamiento; decidir qué hacer con las 12 fotos sin asignar; direcciones de sedes internacionales; backend Express + esquema Neon + `/api/seed`; conectar el repo a Vercel y desplegar.

### 2026-10-18 — Sesión 7: comentarios, fotos reales de accesorios y build

- Auditoría de comentarios: JSDoc en componentes/funciones que faltaban (11 archivos, commit `5445577`); no se cambió lógica.
- `accesoriorar.rar` extraído con `UnRAR.exe` (WinRAR instalado), recortado y centrado en 4:3 con Pillow; 5 fotos reales enlazadas (ver sección 3). (Estado superado por la sesión 8.)
- Verificado: `tsc` limpio; **`next build` OK** (necesita `NODE_OPTIONS=--max-old-space-size=3072`: sin eso murió por memoria); en `localhost:3000` la home da 200, los 10 autos y las 5 fotos nuevas cargan por el optimizador. La calculadora vive en el modal (solo cliente): validada por tipos/build, no abierta en navegador.

### 2026-10-18 — Sesión 8: catálogo de accesorios ajustado a las fotos reales

- Catálogo reestructurado según las fotos del `.rar`: **eliminados** Fox, Dobinsons, Method, Snorkel y Skid Plate (ninguna foto era de esos productos). Suspensión pasó a 3 productos Old Man Emu (había 3 fotos, no 2); cauchos a 3; protección a 3 ARB. Iluminación sin cambios. Total 12 productos / 12 fotos distintas (hash verificado). La pestaña sigue llamándose "Cauchos & Rines" aunque ya no hay rines.
- **Pendiente:** fotos reales de Rigid y Baja Designs; confirmar marca del tercer caucho; confirmar precios (los nuevos son estimados míos).

### 2026-10-18 — Sesión 9: retoques finales de accesorios

- Eliminados Rigid y Baja Designs (sin foto real de producto); pestaña "Cauchos & Rines" renombrada a "Cauchos"; precios ajustados a los rangos de Venezuela dados por el usuario. Catálogo: 10 productos / 10 fotos. La pestaña "Iluminación & Winches" quedó con un solo producto (WARN); su texto se ajustó.
- **Pendiente:** fotos reales y precios confirmados; marca del tercer caucho; decidir si se renombra la pestaña de Iluminación; conectar Vercel y desplegar; backend Express + Neon.

### 2026-10-18 — Sesión 10: cierre v1.0

- **Hito (declarado por el usuario): PROYECTO COMPLETO Y DESPLEGADO EN VERCEL (v1.0 VIP) - Sistema verificado y sincronizado con GitHub.** Nota: el despliegue en Vercel lo confirma el usuario; desde esta sesión no se verificó la URL de Vercel. Backend Express + Neon siguen sin crearse.
- Error "JavaScript heap out of memory": se usó `NODE_OPTIONS=--max-old-space-size=8192`. El borrado de `.next` falló parcialmente porque el dev server (puerto 3000) tiene archivos de caché de Turbopack abiertos; `.next` está ignorado por git. Para limpiarlo del todo: parar el dev server propio, borrar `.next` y relanzar.
