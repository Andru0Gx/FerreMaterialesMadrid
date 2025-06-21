import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "./db"

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

export async function generateOrderNumber(): Promise<string> {
  // Obtener el último número de orden
  const lastOrder = await prisma.order.findFirst({
    orderBy: {
      orderNumber: 'desc'
    }
  });

  let nextNumber = 1;

  if (lastOrder?.orderNumber) {
    // Extraer el número de la última orden (después de #FM-)
    const lastNumber = parseInt(lastOrder.orderNumber.replace('#FM-', ''));
    nextNumber = lastNumber + 1;
  }

  // Formatear el número con ceros a la izquierda (9 dígitos)
  const paddedNumber = nextNumber.toString().padStart(9, '0');
  return `#FM-${paddedNumber}`;
}
