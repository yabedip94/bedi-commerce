import { test, expect } from "@playwright/test";
import {
  validateAndCalculateOrder,
  generateOrderId,
  validateCustomer,
  buildOrder,
} from "@/lib/orders/order-service";
import { createCustomerInfo } from "@/tests/fixtures/test-data";

const validBaseCustomer = createCustomerInfo({
  phone: undefined,
  shippingAddress: {
    street: "Jl. Sudirman No. 45",
    city: "Jakarta Selatan",
    postalCode: "12190",
    province: undefined,
  },
});

test.describe("Order Service Domain & Business Logic Hardening Unit Tests", () => {
  test("1. duplicate product IDs whose combined quantity exceeds stock are rejected with INSUFFICIENT_STOCK", () => {
    // bedi-12 (Rangefinder Camera 35mm) has stockCount: 2
    const payload = {
      customer: validBaseCustomer,
      items: [
        { productId: "bedi-12", quantity: 2 },
        { productId: "bedi-12", quantity: 2 },
      ],
    };

    const result = validateAndCalculateOrder(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toHaveLength(1);
      const error = result.errors[0];
      expect(error.code).toBe("INSUFFICIENT_STOCK");
      expect(error.productId).toBe("bedi-12");
      expect(error.message).toContain("Total kuantitas gabungan");
      expect(error.details).toEqual({
        requestedQuantity: 4,
        availableStock: 2,
        duplicateLineCount: 2,
      });
    }
  });

  test("2. duplicate product IDs whose combined quantity remains within stock are consolidated into a single line item", () => {
    // bedi-12 (Rangefinder Camera 35mm) has stockCount: 2, price: $680
    const payload = {
      customer: validBaseCustomer,
      items: [
        { productId: "bedi-12", quantity: 1 },
        { productId: "bedi-12", quantity: 1 },
      ],
    };

    const result = validateAndCalculateOrder(payload);

    expect(result.success).toBe(true);
    if (result.success) {
      // Exactly 1 consolidated order item
      expect(result.orderData.items).toHaveLength(1);
      const item = result.orderData.items[0];
      expect(item.productId).toBe("bedi-12");
      expect(item.quantity).toBe(2);
      expect(item.unitPrice).toBe(680);
      expect(item.lineTotal).toBe(1360);
      expect(result.orderData.subtotal).toBe(1360);
      expect(result.orderData.shippingFee).toBe(0); // >= 150
      expect(result.orderData.total).toBe(1360);
    }
  });

  test("3. numeric or boolean phone values are rejected with INVALID_INPUT without throwing TypeError", () => {
    // Test numeric phone
    const numericPhonePayload = {
      customer: {
        ...validBaseCustomer,
        phone: 62812345678,
      },
      items: [{ productId: "bedi-01", quantity: 1 }],
    };

    const numResult = validateAndCalculateOrder(numericPhonePayload);
    expect(numResult.success).toBe(false);
    if (!numResult.success) {
      const phoneError = numResult.errors.find((e) => e.field === "customer.phone");
      expect(phoneError).toBeDefined();
      expect(phoneError?.code).toBe("INVALID_INPUT");
      expect(phoneError?.message).toContain("string");
    }

    // Test boolean phone
    const booleanPhonePayload = {
      customer: {
        ...validBaseCustomer,
        phone: true,
      },
      items: [{ productId: "bedi-01", quantity: 1 }],
    };

    const boolResult = validateAndCalculateOrder(booleanPhonePayload);
    expect(boolResult.success).toBe(false);
    if (!boolResult.success) {
      const phoneError = boolResult.errors.find((e) => e.field === "customer.phone");
      expect(phoneError).toBeDefined();
      expect(phoneError?.code).toBe("INVALID_INPUT");
    }
  });

  test("4. numeric or boolean province values are rejected with INVALID_INPUT without throwing TypeError", () => {
    // Test numeric province
    const numericProvinceCustomer = {
      ...validBaseCustomer,
      shippingAddress: {
        ...validBaseCustomer.shippingAddress,
        province: 12345,
      },
    };

    const numErrors = validateCustomer(numericProvinceCustomer);
    const numProvinceErr = numErrors.find(
      (e) => e.field === "customer.shippingAddress.province"
    );
    expect(numProvinceErr).toBeDefined();
    expect(numProvinceErr?.code).toBe("INVALID_INPUT");

    // Test boolean province in full calculation
    const booleanProvincePayload = {
      customer: {
        ...validBaseCustomer,
        shippingAddress: {
          ...validBaseCustomer.shippingAddress,
          province: false,
        },
      },
      items: [{ productId: "bedi-01", quantity: 1 }],
    };

    const boolResult = validateAndCalculateOrder(booleanProvincePayload);
    expect(boolResult.success).toBe(false);
    if (!boolResult.success) {
      const provError = boolResult.errors.find(
        (e) => e.field === "customer.shippingAddress.province"
      );
      expect(provError).toBeDefined();
      expect(provError?.code).toBe("INVALID_INPUT");
    }
  });

  test("5. valid optional customer fields (phone and province strings) are preserved and trimmed", () => {
    const payload = {
      customer: {
        ...validBaseCustomer,
        phone: "  0812-3456-7890  ",
        shippingAddress: {
          ...validBaseCustomer.shippingAddress,
          province: "  DKI Jakarta  ",
        },
      },
      items: [{ productId: "bedi-01", quantity: 1 }],
    };

    const result = validateAndCalculateOrder(payload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.orderData.customer.phone).toBe("0812-3456-7890");
      expect(result.orderData.customer.shippingAddress.province).toBe("DKI Jakarta");
    }
  });

  test("6. omitting optional fields (undefined or null) is valid and produces undefined", () => {
    const payload = {
      customer: {
        ...validBaseCustomer,
        phone: undefined,
        shippingAddress: {
          ...validBaseCustomer.shippingAddress,
          province: undefined,
        },
      },
      items: [{ productId: "bedi-01", quantity: 1 }],
    };

    const result = validateAndCalculateOrder(payload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.orderData.customer.phone).toBeUndefined();
      expect(result.orderData.customer.shippingAddress.province).toBeUndefined();
    }
  });

  test("7. generateOrderId format matches ORD-YYYYMMDD-XXXXXXXX pattern with 8 hex characters", () => {
    const orderId = generateOrderId();
    const regex = /^ORD-\d{8}-[0-9A-F]{8}$/;
    expect(orderId).toMatch(regex);
  });

  test("8. generateOrderId produces distinct identifiers across successive calls without collision", () => {
    const sampleSize = 100;
    const ids = new Set<string>();

    for (let i = 0; i < sampleSize; i++) {
      const id = generateOrderId();
      ids.add(id);
    }

    // Every generated ID must be unique
    expect(ids.size).toBe(sampleSize);
  });

  test("9. buildOrder integrates generated ID, orderData, and ISO 8601 timestamps", () => {
    const payload = {
      customer: validBaseCustomer,
      items: [{ productId: "bedi-01", quantity: 1 }],
    };

    const result = validateAndCalculateOrder(payload);
    expect(result.success).toBe(true);

    if (result.success) {
      const order = buildOrder(result.orderData);
      expect(order.id).toMatch(/^ORD-\d{8}-[0-9A-F]{8}$/);
      expect(order.status).toBe("confirmed");
      expect(order.createdAt).toBeDefined();
      expect(order.updatedAt).toBeDefined();
      expect(new Date(order.createdAt).toISOString()).toBe(order.createdAt);
    }
  });
});
