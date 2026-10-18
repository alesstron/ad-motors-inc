/**
 * ============================================================================
 *  src/lib/finance.ts — CÁLCULO DE LA CUOTA DE FINANCIAMIENTO
 * ============================================================================
 *  Función pura (sin React): recibe el precio, el % de inicial, el plazo y la
 *  tasa, y devuelve los montos. Se usa en la calculadora de la ficha técnica.
 *  Los parámetros (tasa, plazos, rangos) viven en `FINANCING` de src/data/site.ts.
 *
 *  Método: cuota fija "francesa" (la que usan la mayoría de bancos):
 *      cuota = monto × r / (1 − (1 + r)^−n)      con r = tasa anual / 12
 *  Si la tasa es 0, la cuota es simplemente monto ÷ meses.
 * ============================================================================
 */

/** Datos de entrada del cálculo. */
interface FinanceInput {
  /** Precio del vehículo en USD. */
  price: number;
  /** Porcentaje de inicial (por ejemplo 40 = 40 %). */
  downPct: number;
  /** Plazo en meses. */
  months: number;
  /** Tasa anual en decimal (0.12 = 12 %). */
  annualRate: number;
}

/** Resultado del cálculo, todo en USD. */
export interface FinanceResult {
  /** Monto de la inicial. */
  down: number;
  /** Monto que queda por financiar (precio − inicial). */
  financed: number;
  /** Cuota mensual estimada. */
  payment: number;
  /** Total pagado: inicial + todas las cuotas. */
  total: number;
  /** Intereses totales (cuotas − monto financiado). */
  interest: number;
}

export function calcFinancing({ price, downPct, months, annualRate }: FinanceInput): FinanceResult {
  const down = (price * downPct) / 100;
  const financed = price - down;
  const r = annualRate / 12;
  // Con tasa 0 la fórmula francesa divide entre cero, así que se trata aparte.
  const payment = r === 0 ? financed / months : (financed * r) / (1 - Math.pow(1 + r, -months));
  const paid = payment * months;
  return { down, financed, payment, total: down + paid, interest: paid - financed };
}
