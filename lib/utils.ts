import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("us-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

interface FormattedPrice {
  usd: string;
  bs: string;
  combined: string;
}

export function formatPrice(amount: number, rate?: number | null): FormattedPrice {
  const usd = formatCurrency(amount);
  const bs = rate ? `Bs. ${(amount * rate).toFixed(2)}` : 'N/A';
  const combined = rate ? `${usd} (${bs})` : usd;

  return {
    usd,
    bs,
    combined
  };
}
