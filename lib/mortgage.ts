/**
 * Mortgage maths for the calculator section.
 * Standard amortised fixed-rate loan — no fees, taxes or insurance modelled.
 */

export interface MortgageInput {
  /** Full property price in EGP. */
  price: number;
  /** Deposit as a percentage of price (0–100). */
  downPaymentPct: number;
  /** Nominal annual interest rate as a percentage, e.g. 14.5. */
  annualRatePct: number;
  /** Loan term in years. */
  years: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  principal: number;
  downPayment: number;
  totalInterest: number;
  totalPaid: number;
  /** 0–1, principal's share of everything paid. Drives the donut chart. */
  principalShare: number;
}

export function calculateMortgage({
  price,
  downPaymentPct,
  annualRatePct,
  years,
}: MortgageInput): MortgageResult {
  const downPayment = price * (downPaymentPct / 100);
  const principal = Math.max(price - downPayment, 0);
  const months = Math.max(Math.round(years * 12), 1);
  const monthlyRate = annualRatePct / 100 / 12;

  // A 0% rate would divide by zero in the amortisation formula.
  const monthlyPayment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const totalPaid = monthlyPayment * months;
  const totalInterest = Math.max(totalPaid - principal, 0);

  return {
    monthlyPayment: Number.isFinite(monthlyPayment) ? monthlyPayment : 0,
    principal,
    downPayment,
    totalInterest,
    totalPaid,
    principalShare: totalPaid > 0 ? principal / totalPaid : 1,
  };
}
