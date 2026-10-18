/**
 * ============================================================================
 *  src/context/BookingContext.tsx — "PUENTE" HACIA EL FORMULARIO DE CITAS
 * ============================================================================
 *  PROBLEMA: los botones "Agendar Cita" y "Solicitar Pre-Aprobación" viven
 *  dentro de la ficha técnica (modal), pero el formulario de citas está mucho
 *  más abajo en la página. Son componentes separados que no se conocen entre sí.
 *
 *  SOLUCIÓN: un "contexto" de React, una cajita compartida donde se guarda qué
 *  vehículo eligió la persona y, opcionalmente, datos para PRE-LLENAR el
 *  formulario (tipo de cita y notas, por ejemplo el resumen del
 *  financiamiento). La ficha escribe en la cajita y el formulario la lee.
 * ============================================================================
 */

'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { scrollToSection } from '@/lib/scroll';

/** Datos opcionales con los que se pre-llena el formulario de citas. */
export interface BookingPrefill {
  /** Tipo de servicio: 'test-drive' | 'inspeccion' | 'compra'. */
  tipo?: 'test-drive' | 'inspeccion' | 'compra';
  /** Texto para el campo "Notas" (por ejemplo, el resumen del financiamiento). */
  notas?: string;
}

/** Lo que ofrece la cajita compartida a quien la use. */
interface BookingContextValue {
  /** `id` del vehículo elegido para la cita ('' = ninguno todavía). */
  vehicleId: string;
  /** Datos de pre-llenado vigentes. */
  prefill: BookingPrefill;
  /**
   * Cambia cada vez que se pide un nuevo pre-llenado. El formulario lo usa como
   * `key` para reiniciarse con los datos nuevos.
   */
  prefillVersion: number;
  /** Preselecciona un vehículo (y datos opcionales) y lleva a la persona al formulario. */
  book: (vehicleId?: string, prefill?: BookingPrefill) => void;
  /** Cambia el vehículo elegido sin desplazar la página (lo usa el selector del formulario). */
  setVehicleId: (id: string) => void;
}

/** El contexto en sí. Empieza vacío (null) y lo llena <BookingProvider>. */
const BookingContext = createContext<BookingContextValue | null>(null);

/** Envuelve la página (ver src/components/Providers.tsx). */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  // ESTADO: vehículo elegido para la cita. '' = ninguno.
  const [vehicleId, setVehicleId] = useState('');
  // ESTADO: datos de pre-llenado y su versión.
  const [prefill, setPrefill] = useState<BookingPrefill>({});
  const [prefillVersion, setPrefillVersion] = useState(0);

  /**
   * Guarda el vehículo y el pre-llenado, y hace scroll suave hasta #citas.
   * `scrollToSection` espera a que la ficha técnica termine de cerrarse, porque
   * mientras está abierta bloquea el scroll de la página.
   */
  const book = useCallback((id?: string, data?: BookingPrefill) => {
    if (id) setVehicleId(id);
    if (data) {
      setPrefill(data);
      setPrefillVersion((v) => v + 1);
    }
    scrollToSection('citas');
  }, []);

  // useMemo evita recrear el objeto en cada render y re-dibujar de más a los consumidores.
  const value = useMemo(
    () => ({ vehicleId, prefill, prefillVersion, book, setVehicleId }),
    [vehicleId, prefill, prefillVersion, book],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

/** Hook para leer/usar la cajita compartida desde cualquier componente hijo. */
export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking debe usarse dentro de <BookingProvider>');
  return ctx;
}
