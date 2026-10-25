export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  province?: string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone?: string;
  shippingAddress: ShippingAddress;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  customer: CustomerInfo;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for an individual order item submitted by the client.
 * Note: prices or line totals submitted will be intentionally ignored.
 */
export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  [key: string]: unknown;
}

/**
 * Input payload for creating a new order submitted by the client.
 * Note: subtotals, shipping fees, or totals submitted will be intentionally ignored.
 */
export interface CreateOrderInput {
  customer: CustomerInfo;
  items: CreateOrderItemInput[];
  [key: string]: unknown;
}

export type OrderErrorCode =
  | "BAD_REQUEST"
  | "INVALID_INPUT"
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_UNAVAILABLE"
  | "INSUFFICIENT_STOCK";

export interface OrderValidationError {
  code: OrderErrorCode;
  field?: string;
  productId?: string;
  message: string;
  details?: Record<string, unknown>;
}

export type OrderCalculationData = Omit<Order, "id" | "createdAt" | "updatedAt">;

export type OrderCalculationResult =
  | {
      success: true;
      orderData: OrderCalculationData;
    }
  | {
      success: false;
      errors: OrderValidationError[];
    };
