import { SAMPLE_PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import {
  CustomerInfo,
  CreateOrderInput,
  CreateOrderItemInput,
} from "@/types/order";

/**
 * Standard baseline customer test data.
 */
export const DEFAULT_TEST_CUSTOMER: Readonly<CustomerInfo> = Object.freeze({
  fullName: "Budi Santoso",
  email: "budi.santoso@example.com",
  phone: "08123456789",
  shippingAddress: Object.freeze({
    street: "Jl. Sudirman No. 45",
    city: "Jakarta Selatan",
    postalCode: "12190",
    province: "DKI Jakarta",
  }),
});

/**
 * Creates a fresh, deep-copied CustomerInfo object with optional field overrides.
 * Guarantees no shared mutable state between test executions.
 */
export function createCustomerInfo(
  overrides?: Partial<CustomerInfo>
): CustomerInfo {
  return {
    fullName: overrides?.fullName ?? DEFAULT_TEST_CUSTOMER.fullName,
    email: overrides?.email ?? DEFAULT_TEST_CUSTOMER.email,
    phone:
      overrides && "phone" in overrides
        ? overrides.phone
        : DEFAULT_TEST_CUSTOMER.phone,
    shippingAddress: {
      street:
        overrides?.shippingAddress?.street ??
        DEFAULT_TEST_CUSTOMER.shippingAddress.street,
      city:
        overrides?.shippingAddress?.city ??
        DEFAULT_TEST_CUSTOMER.shippingAddress.city,
      postalCode:
        overrides?.shippingAddress?.postalCode ??
        DEFAULT_TEST_CUSTOMER.shippingAddress.postalCode,
      province:
        overrides?.shippingAddress && "province" in overrides.shippingAddress
          ? overrides.shippingAddress.province
          : DEFAULT_TEST_CUSTOMER.shippingAddress.province,
    },
  };
}

/**
 * Creates a fresh order payload conforming to the POST /api/orders request contract.
 * By default, generates a valid payload with 1 unit of Precision Wireless Mouse M-03 (bedi-06).
 */
export function createOrderPayload(
  overrides?: Partial<CreateOrderInput>
): CreateOrderInput {
  const defaultItems: CreateOrderItemInput[] = [
    { productId: "bedi-06", quantity: 1 },
  ];

  return {
    customer: overrides?.customer
      ? createCustomerInfo(overrides.customer)
      : createCustomerInfo(),
    items: overrides?.items
      ? overrides.items.map((item) => ({ ...item }))
      : defaultItems,
    ...overrides,
  };
}

/**
 * Retrieves a product from the authoritative catalog by ID.
 * Returns a cloned Product entity or throws a descriptive error if not found.
 */
export function getTestProduct(productId: string): Product {
  const product = SAMPLE_PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    throw new Error(
      `Product with ID "${productId}" not found in authoritative SAMPLE_PRODUCTS catalog.`
    );
  }
  return { ...product };
}
