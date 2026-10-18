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

/**
 * Calcula inicial, monto financiado, cuota mensual y totales (todo en USD).
 *
 * Paso a paso, con un ejemplo: precio $100.000, inicial 40 %, 24 meses, tasa 12 %:
 *  1. inicial   = precio × % / 100            → $40.000
 *  2. financiado = precio − inicial           → $60.000
 *  3. r (tasa mensual) = tasa anual / 12      → 0,01
 *  4. cuota = financiado × r / (1 − (1 + r)^−meses)   → ≈ $2.824,41
 *  5. total = inicial + cuota × meses         → ≈ $107.785,84
 * Para pasar la cuota a bolívares se multiplica por `USD_TO_BS` (lo hace el componente).
 */
export function calcFinancing({ price, downPct, months, annualRate }: FinanceInput): FinanceResult {
  const down = (price * downPct) / 100;
  const financed = price - down;
  const r = annualRate / 12;
  // Con tasa 0 la fórmula francesa divide entre cero, así que se trata aparte.
  const payment = r === 0 ? financed / months : (financed * r) / (1 - Math.pow(1 + r, -months));
  const paid = payment * months;
  return { down, financed, payment, total: down + paid, interest: paid - financed };
}
