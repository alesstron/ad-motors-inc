/**
 * ============================================================================
 *  src/types/vehicle.ts — "MOLDE" DE UN VEHÍCULO
 * ============================================================================
 *  Aquí se define QUÉ datos tiene cada vehículo. Es como el formulario en
 *  blanco: el catálogo real (src/data/vehicles.ts) lo llena una vez por auto.
 *
 *  Si inventas un campo nuevo (por ejemplo "placa"), agrégalo aquí primero y
 *  luego rellénalo en cada vehículo de src/data/vehicles.ts. TypeScript te
 *  avisará con un error si olvidas completarlo en alguno.
 * ============================================================================
 */

/** Marcas disponibles. Para añadir una marca nueva, agrégala también en src/data/filters.ts. */
export type Brand = 'Toyota' | 'Ford' | 'Chevrolet' | 'Mercedes-Benz' | 'BMW' | 'Porsche';

/** Categorías que aparecen como filtro. Deben coincidir con la lista de src/data/filters.ts. */
export type Category = 'SUV 4x4' | 'Pick-Up' | 'Deportivo' | 'Sedán';

/**
 * Estado comercial del vehículo (el "badge" de la tarjeta):
 *  - "Certificado AD":     pasó la inspección multipunto de AD Motors.
 *  - "Entrega Inmediata":  está listo para entregarse hoy mismo.
 *  - "Disponible":         está en inventario.
 */
export type Status = 'Certificado AD' | 'Entrega Inmediata' | 'Disponible';

/**
 * De dónde sale el precio (se muestra como nota en la ficha técnica):
 *  - "cliente":     precio indicado por el dueño del negocio (AD Motors).
 *  - "referencia":  precio tomado de un anuncio/lista oficial (se explica en `priceSource`).
 *  - "estimado":    cálculo aproximado sin fuente verificable. Confírmalo antes de publicar.
 */
export type PriceBasis = 'cliente' | 'referencia' | 'estimado';

/** Todos los datos de un vehículo del catálogo. */
export interface Vehicle {
  /** Identificador único, sin espacios ni acentos. No puede repetirse entre vehículos. */
  id: string;
  brand: Brand;
  /** Modelo, por ejemplo "4Runner". */
  model: string;
  /** Versión o edición, por ejemplo "Limited 4WD". */
  trim: string;
  /** Año del modelo. El filtro de años va de YEAR_MIN a YEAR_MAX (src/data/filters.ts). */
  year: number;
  category: Category;
  /** Precio en dólares (USD), SIN puntos ni símbolo: 28500, no "$28.500". */
  price: number;
  priceBasis: PriceBasis;
  /** Texto opcional que explica la fuente del precio cuando es "referencia". */
  priceSource?: string;
  status: Status;
  /** Kilometraje. Usa 0 para unidades nuevas. */
  /** Ciudad y zona donde está la unidad, por ejemplo "Baruta, Caracas". */
  location: string;
  mileage: number;
  transmission: string;
  engine: string;
  /** Potencia, por ejemplo "270 hp". */
  power: string;
  /** Descripción de la tracción, por ejemplo "4x4 con reductora". */
  drivetrain: string;
  /** true = muestra "4x4" en la tarjeta; false = muestra la tracción tal cual. */
  fourByFour: boolean;
  fuel: string;
  color: string;
  /** Párrafo de presentación que se ve en la ficha técnica. */
  description: string;
  /** Etiquetas cortas de equipamiento destacado (3 o 4 funcionan mejor). */
  highlights: string[];
  /**
   * Fotos del vehículo: rutas locales ('/images/vehicles/archivo.jpg', con el archivo en
   * public/images/vehicles/) o enlaces directos (https) a imágenes.
   * La PRIMERA es la portada de la tarjeta; todas forman la galería del modal.
   */
  images: string[];
}
