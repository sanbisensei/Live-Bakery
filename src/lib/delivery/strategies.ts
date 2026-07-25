// Strategy Pattern — Behavioural
// Each delivery type is a separate strategy with the same interface.
// Checkout calls calculateFee() without knowing which strategy is active.

export interface DeliveryStrategy {
  type: "standard" | "fast";
  label: string;
  description: string;
  calculateFee(): number;
}

export class StandardDelivery implements DeliveryStrategy {
  readonly type = "standard" as const;
  label = "Standard delivery";
  description = "3–5 business days";

  calculateFee(): number {
    return 70;
  }
}

export class FastDelivery implements DeliveryStrategy {
  readonly type = "fast" as const;
  label = "Fast delivery";
  description = "1–2 business days";

  calculateFee(): number {
    return 150;
  }
}

// Factory function — picks the right strategy based on type string
export function getDeliveryStrategy(
  type: "standard" | "fast",
): DeliveryStrategy {
  if (type === "fast") return new FastDelivery();
  return new StandardDelivery();
}

// All available strategies — used to render options in checkout UI
export const deliveryStrategies: DeliveryStrategy[] = [
  new StandardDelivery(),
  new FastDelivery(),
];
