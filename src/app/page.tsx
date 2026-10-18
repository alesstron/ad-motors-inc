/**
 * ============================================================================
 *  src/app/page.tsx — PÁGINA DE INICIO (la única página del sitio)
 * ============================================================================
 *  En Next.js, el archivo `page.tsx` dentro de `src/app/` ES la página
 *  principal (la dirección "/"). Aquí solo se COLOCAN los bloques en orden,
 *  de arriba hacia abajo. Cada bloque vive en su propio archivo dentro de
 *  src/components/.
 *
 *  Para reordenar la página, mueve las líneas. Para quitar una sección,
 *  bórrala (o coméntala). Para agregar una nueva, crea el componente en
 *  src/components/ e impórtalo aquí.
 *
 *  Mapa de la página:
 *    Navbar            → barra superior flotante (con switch USD/Bs. y Garaje)
 *    VehicleGrid       → portada (Hero) + filtros + cuadrícula + ficha técnica
 *    AccessoriesSection→ accesorios y equipamiento 4x4 con presupuesto
 *    ServicesVIP       → atención 24/7, entrega, inspección y financiamiento
 *    AppointmentForm   → formulario de citas
 *    Locations         → sedes (Barquisimeto, CDMX, Madrid)
 *    Footer            → pie de página
 *  Capas flotantes (no ocupan lugar en la página):
 *    FloatingWhatsApp  → botón verde de WhatsApp
 *    CompareBar        → barra para comparar vehículos
 *    CompareModal      → comparador lado a lado
 *    GarageDrawer      → panel lateral "Mi Garaje"
 * ============================================================================
 */

import { AccessoriesSection } from '@/components/AccessoriesSection';
import { AppointmentForm } from '@/components/AppointmentForm';
import { CompareBar } from '@/components/CompareBar';
import { CompareModal } from '@/components/CompareModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';
import { GarageDrawer } from '@/components/GarageDrawer';
import { Locations } from '@/components/Locations';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { ServicesVIP } from '@/components/ServicesVIP';
import { VehicleGrid } from '@/components/VehicleGrid';

export default function Home() {
  return (
    // Providers comparte moneda, garaje, accesorios y citas entre todos los componentes.
    <Providers>
      <Navbar />
      {/* <main> es el contenido principal; `flex-1` lo estira para empujar el pie hacia abajo. */}
      <main className="flex-1">
        <VehicleGrid />
        <AccessoriesSection />
        <ServicesVIP />
        <AppointmentForm />
        <Locations />
      </main>
      <Footer />

      {/* Capas flotantes. */}
      <FloatingWhatsApp />
      <CompareBar />
      <CompareModal />
      <GarageDrawer />
    </Providers>
  );
}
