import { test, expect } from "@playwright/test";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import {
  PostgresOrderRepository,
  DuplicateOrderError,
} from "@/lib/orders/order-repository";
import { Order } from "@/types/order";
import { createCustomerInfo } from "@/tests/fixtures/test-data";

const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgres://postgres@localhost:5432/bedi_commerce_test";

test.describe("PostgreSQL Order Repository Integration Tests (bedi_commerce_test)", () => {
  let testClient: ReturnType<typeof postgres>;
  let testDb: ReturnType<typeof drizzle<typeof schema>>;
  let repository: PostgresOrderRepository;

  test.beforeAll(async () => {
    testClient = postgres(TEST_DATABASE_URL, { prepare: false });
    testDb = drizzle(testClient, { schema });
    repository = new PostgresOrderRepository(testDb);
  });

  test.afterAll(async () => {
    if (testClient) {
      await testClient.end();
    }
  });

  function createSampleOrder(customId?: string): Order {
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const id = customId || `ORD-TEST-${Date.now()}-${randomSuffix}`;

    return {
      id,
      status: "confirmed",
      customer: createCustomerInfo({
        fullName: "Test Customer",
        email: "test.customer@example.com",
        phone: "08123456789",
        shippingAddress: {
          street: "Jl. Test No. 123",
          city: "Jakarta Pusat",
          postalCode: "10110",
          province: "DKI Jakarta",
        },
      }),
      subtotal: 468,
      shippingFee: 0,
      total: 468,
      items: [
        {
          productId: "bedi-01",
          productName: "Studio-01 Wireless Headphones",
          unitPrice: 349,
          quantity: 1,
          lineTotal: 349,
        },
        {
          productId: "bedi-06",
          productName: "Precision Wireless Mouse M-03",
          unitPrice: 119,
          quantity: 1,
          lineTotal: 119,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  test("1. successfully creates an order and retrieves it by ID", async () => {
    const sampleOrder = createSampleOrder();

    const created = await repository.create(sampleOrder);
    expect(created.id).toBe(sampleOrder.id);

    const found = await repository.findById(sampleOrder.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(sampleOrder.id);
    expect(found?.status).toBe("confirmed");
    expect(found?.customer.fullName).toBe("Test Customer");
    expect(found?.customer.email).toBe("test.customer@example.com");
    expect(found?.customer.phone).toBe("08123456789");
    expect(found?.customer.shippingAddress.street).toBe("Jl. Test No. 123");
    expect(found?.customer.shippingAddress.city).toBe("Jakarta Pusat");
    expect(found?.customer.shippingAddress.postalCode).toBe("10110");
    expect(found?.customer.shippingAddress.province).toBe("DKI Jakarta");
    expect(found?.subtotal).toBe(468);
    expect(found?.shippingFee).toBe(0);
    expect(found?.total).toBe(468);
  });

  test("2. persists all associated order items accurately with price and name snapshots", async () => {
    const sampleOrder = createSampleOrder();

    await repository.create(sampleOrder);
    const found = await repository.findById(sampleOrder.id);

    expect(found?.items).toHaveLength(2);

    const item1 = found?.items.find((i) => i.productId === "bedi-01");
    expect(item1).toBeDefined();
    expect(item1?.productName).toBe("Studio-01 Wireless Headphones");
    expect(item1?.unitPrice).toBe(349);
    expect(item1?.quantity).toBe(1);
    expect(item1?.lineTotal).toBe(349);

    const item2 = found?.items.find((i) => i.productId === "bedi-06");
    expect(item2).toBeDefined();
    expect(item2?.productName).toBe("Precision Wireless Mouse M-03");
    expect(item2?.unitPrice).toBe(119);
    expect(item2?.quantity).toBe(1);
    expect(item2?.lineTotal).toBe(119);
  });

  test("3. returns null when searching for a nonexistent order ID", async () => {
    const found = await repository.findById("ORD-NONEXISTENT-9999");
    expect(found).toBeNull();
  });

  test("4. rejects duplicate order IDs with DuplicateOrderError", async () => {
    const fixedId = `ORD-DUP-${Date.now()}`;
    const order1 = createSampleOrder(fixedId);
    const order2 = createSampleOrder(fixedId);

    await repository.create(order1);

    await expect(repository.create(order2)).rejects.toThrow(DuplicateOrderError);
  });

  test("5. rolls back the transaction when item insertion fails, leaving zero partial records", async () => {
    const invalidOrder = createSampleOrder();
    // Invalidate item by setting negative quantity which violates CHECK constraint "order_items_quantity_positive"
    invalidOrder.items.push({
      productId: "bedi-invalid",
      productName: "Invalid Constraint Item",
      unitPrice: 100,
      quantity: -5, // Violates check (quantity > 0)
      lineTotal: -500,
    });

    // Create must fail and roll back the whole transaction
    await expect(repository.create(invalidOrder)).rejects.toThrow();

    // Verify order was not created via repository findById
    const foundViaRepo = await repository.findById(invalidOrder.id);
    expect(foundViaRepo).toBeNull();

    // Verify directly against orders table to confirm no orphaned header was committed
    const directQuery = await testDb
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, invalidOrder.id));

    expect(directQuery).toHaveLength(0);
  });

  test("6. cascading delete removes child items when an order is deleted", async () => {
    const sampleOrder = createSampleOrder();
    await repository.create(sampleOrder);

    // Verify items exist
    const itemsBefore = await testDb
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, sampleOrder.id));
    expect(itemsBefore.length).toBeGreaterThan(0);

    // Delete the order directly
    await testDb
      .delete(schema.orders)
      .where(eq(schema.orders.id, sampleOrder.id));

    // Verify child items were deleted automatically by ON DELETE CASCADE
    const itemsAfter = await testDb
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, sampleOrder.id));
    expect(itemsAfter).toHaveLength(0);
  });
});
