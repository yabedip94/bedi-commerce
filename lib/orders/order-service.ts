import crypto from "crypto";
import { SAMPLE_PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import {
  CustomerInfo,
  Order,
  OrderCalculationData,
  OrderCalculationResult,
  OrderItem,
  OrderValidationError,
  ShippingAddress,
} from "@/types/order";

export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_FEE = 15;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates customer contact and shipping information.
 * Returns an array of validation errors, or an empty array if valid.
 */
export function validateCustomer(customer: unknown): OrderValidationError[] {
  const errors: OrderValidationError[] = [];

  if (!customer || typeof customer !== "object") {
    errors.push({
      code: "BAD_REQUEST",
      field: "customer",
      message: "Data pelanggan (customer) wajib diisi.",
    });
    return errors;
  }

  const c = customer as Partial<CustomerInfo>;

  if (!c.fullName || typeof c.fullName !== "string" || c.fullName.trim().length < 2) {
    errors.push({
      code: "INVALID_INPUT",
      field: "customer.fullName",
      message: "Nama lengkap pelanggan wajib diisi (minimal 2 karakter).",
    });
  }

  if (!c.email || typeof c.email !== "string" || !EMAIL_REGEX.test(c.email.trim())) {
    errors.push({
      code: "INVALID_INPUT",
      field: "customer.email",
      message: "Format email pelanggan tidak valid.",
    });
  }

  // Validate optional phone field if provided
  if (c.phone !== undefined && c.phone !== null) {
    if (typeof c.phone !== "string") {
      errors.push({
        code: "INVALID_INPUT",
        field: "customer.phone",
        message: "Nomor telepon harus berupa string jika disertakan.",
      });
    }
  }

  if (!c.shippingAddress || typeof c.shippingAddress !== "object") {
    errors.push({
      code: "BAD_REQUEST",
      field: "customer.shippingAddress",
      message: "Alamat pengiriman wajib diisi.",
    });
  } else {
    const addr = c.shippingAddress as Partial<ShippingAddress>;

    if (!addr.street || typeof addr.street !== "string" || addr.street.trim().length < 3) {
      errors.push({
        code: "INVALID_INPUT",
        field: "customer.shippingAddress.street",
        message: "Alamat jalan wajib diisi (minimal 3 karakter).",
      });
    }

    if (!addr.city || typeof addr.city !== "string" || addr.city.trim().length < 2) {
      errors.push({
        code: "INVALID_INPUT",
        field: "customer.shippingAddress.city",
        message: "Kota pengiriman wajib diisi.",
      });
    }

    if (!addr.postalCode || typeof addr.postalCode !== "string" || addr.postalCode.trim().length < 3) {
      errors.push({
        code: "INVALID_INPUT",
        field: "customer.shippingAddress.postalCode",
        message: "Kode pos pengiriman wajib diisi.",
      });
    }

    // Validate optional province field if provided
    if (addr.province !== undefined && addr.province !== null) {
      if (typeof addr.province !== "string") {
        errors.push({
          code: "INVALID_INPUT",
          field: "customer.shippingAddress.province",
          message: "Provinsi pengiriman harus berupa string jika disertakan.",
        });
      }
    }
  }

  return errors;
}

/**
 * Calculates shipping fee based on subtotal.
 * Business Rule: Subtotal >= $150 qualifies for free shipping ($0); otherwise flat $15.
 */
export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

interface AggregatedItemEntry {
  product: Product;
  totalQuantity: number;
  indices: number[];
}

/**
 * Validates order payload, verifies product existence, stock availability,
 * aggregates duplicate product line items, and recalculates line totals,
 * subtotal, shipping fee, and grand total.
 *
 * Never trusts prices, shipping fees, or totals submitted by the client.
 */
export function validateAndCalculateOrder(
  input: unknown,
  catalog: Product[] = SAMPLE_PRODUCTS
): OrderCalculationResult {
  const errors: OrderValidationError[] = [];

  if (!input || typeof input !== "object") {
    return {
      success: false,
      errors: [
        {
          code: "BAD_REQUEST",
          message: "Payload pesanan tidak valid atau kosong.",
        },
      ],
    };
  }

  const payload = input as {
    customer?: unknown;
    items?: unknown;
  };

  // 1. Validate Customer Info
  const customerErrors = validateCustomer(payload.customer);
  errors.push(...customerErrors);

  // 2. Validate Items Array
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push({
      code: "BAD_REQUEST",
      field: "items",
      message: "Pesanan harus memiliki minimal satu item produk.",
    });
    return { success: false, errors };
  }

  // Fast catalog lookup map
  const catalogMap = new Map<string, Product>(
    catalog.map((product) => [product.id, product])
  );

  // Aggregation map to combine duplicate product line items before stock checking
  const aggregatedMap = new Map<string, AggregatedItemEntry>();

  // 3. Validate Each Item against Authoritative Catalog & Aggregate Quantities
  for (let i = 0; i < payload.items.length; i++) {
    const rawItem = payload.items[i];

    if (!rawItem || typeof rawItem !== "object") {
      errors.push({
        code: "INVALID_INPUT",
        field: `items[${i}]`,
        message: `Format item pada indeks ${i} tidak valid.`,
      });
      continue;
    }

    const { productId, quantity } = rawItem as {
      productId?: unknown;
      quantity?: unknown;
    };

    if (!productId || typeof productId !== "string" || productId.trim() === "") {
      errors.push({
        code: "INVALID_INPUT",
        field: `items[${i}].productId`,
        message: `ID produk pada indeks ${i} wajib diisi.`,
      });
      continue;
    }

    const trimmedProductId = productId.trim();
    const product = catalogMap.get(trimmedProductId);

    if (!product) {
      errors.push({
        code: "PRODUCT_NOT_FOUND",
        field: `items[${i}].productId`,
        productId: trimmedProductId,
        message: `Produk dengan ID "${trimmedProductId}" tidak ditemukan di katalog.`,
      });
      continue;
    }

    // Validate quantity is a positive integer
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      errors.push({
        code: "INVALID_INPUT",
        field: `items[${i}].quantity`,
        productId: trimmedProductId,
        message: `Kuantitas untuk "${product.name}" harus berupa bilangan bulat positif lebih dari 0.`,
      });
      continue;
    }

    // Validate product availability
    if (!product.inStock || product.stockCount <= 0) {
      errors.push({
        code: "PRODUCT_UNAVAILABLE",
        field: `items[${i}].productId`,
        productId: trimmedProductId,
        message: `Produk "${product.name}" saat ini tidak tersedia atau stok habis.`,
        details: { availableStock: 0 },
      });
      continue;
    }

    // Aggregate quantities for identical product IDs
    const existing = aggregatedMap.get(trimmedProductId);
    if (existing) {
      existing.totalQuantity += quantity;
      existing.indices.push(i);
    } else {
      aggregatedMap.set(trimmedProductId, {
        product,
        totalQuantity: quantity,
        indices: [i],
      });
    }
  }

  // 4. Validate Aggregated Quantities Against Stock Limits
  const calculatedItems: OrderItem[] = [];

  for (const [productId, entry] of aggregatedMap.entries()) {
    const { product, totalQuantity, indices } = entry;

    if (totalQuantity > product.stockCount) {
      errors.push({
        code: "INSUFFICIENT_STOCK",
        field: indices.length > 1 ? "items" : `items[${indices[0]}].quantity`,
        productId,
        message:
          indices.length > 1
            ? `Total kuantitas gabungan untuk "${product.name}" (${totalQuantity}) melebihi stok yang tersedia (${product.stockCount}).`
            : `Kuantitas yang diminta untuk "${product.name}" (${totalQuantity}) melebihi stok yang tersedia (${product.stockCount}).`,
        details: {
          requestedQuantity: totalQuantity,
          availableStock: product.stockCount,
          duplicateLineCount: indices.length,
        },
      });
    } else {
      // Consolidate into one line item per product
      const unitPrice = product.price;
      const lineTotal = unitPrice * totalQuantity;

      calculatedItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice,
        quantity: totalQuantity,
        lineTotal,
      });
    }
  }

  // Return validation errors if any validation check failed
  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 5. Calculate Subtotal, Shipping Fee, and Grand Total
  const subtotal = calculatedItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const shippingFee = calculateShippingFee(subtotal);
  const total = subtotal + shippingFee;

  // 6. Sanitize Customer Data
  const rawCustomer = payload.customer as CustomerInfo;
  const rawAddress = (rawCustomer.shippingAddress || {}) as Partial<ShippingAddress>;

  const sanitizedPhone =
    typeof rawCustomer.phone === "string" && rawCustomer.phone.trim().length > 0
      ? rawCustomer.phone.trim()
      : undefined;

  const sanitizedProvince =
    typeof rawAddress.province === "string" && rawAddress.province.trim().length > 0
      ? rawAddress.province.trim()
      : undefined;

  const sanitizedCustomer: CustomerInfo = {
    fullName: typeof rawCustomer.fullName === "string" ? rawCustomer.fullName.trim() : "",
    email: typeof rawCustomer.email === "string" ? rawCustomer.email.trim().toLowerCase() : "",
    phone: sanitizedPhone,
    shippingAddress: {
      street: typeof rawAddress.street === "string" ? rawAddress.street.trim() : "",
      city: typeof rawAddress.city === "string" ? rawAddress.city.trim() : "",
      postalCode: typeof rawAddress.postalCode === "string" ? rawAddress.postalCode.trim() : "",
      province: sanitizedProvince,
    },
  };

  const orderData: OrderCalculationData = {
    customer: sanitizedCustomer,
    items: calculatedItems,
    subtotal,
    shippingFee,
    total,
    status: "confirmed",
  };

  return {
    success: true,
    orderData,
  };
}

/**
 * Generates an order identifier with format: ORD-YYYYMMDD-XXXXXXXX
 * Uses crypto.randomUUID() for high collision resistance.
 *
 * Note: While cryptographically collision-resistant, true uniqueness
 * across the system must be enforced by the storage repository upon insert.
 */
export function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `ORD-${dateStr}-${randomSuffix}`;
}

/**
 * Assembles a complete Order entity with identifier and ISO timestamps.
 */
export function buildOrder(
  orderData: OrderCalculationData,
  id: string = generateOrderId()
): Order {
  const now = new Date().toISOString();
  return {
    id,
    ...orderData,
    createdAt: now,
    updatedAt: now,
  };
}
