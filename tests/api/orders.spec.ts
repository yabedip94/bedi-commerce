import { test, expect } from "@playwright/test";

interface ApiValidationErrorDetail {
  code?: string;
  field?: string;
  message?: string;
}

const validBaseCustomer = {
  fullName: "Budi Santoso",
  email: "budi.santoso@example.com",
  phone: "08123456789",
  shippingAddress: {
    street: "Jl. Sudirman No. 45",
    city: "Jakarta Selatan",
    postalCode: "12190",
    province: "DKI Jakarta",
  },
};

test.describe("Order API Endpoints (/api/orders)", () => {
  test("1. POST /api/orders creates order with subtotal below $150 and applies $15 shipping fee", async ({
    request,
  }) => {
    // bedi-06 (Precision Wireless Mouse M-03) has price: $119, stockCount: 15
    const payload = {
      customer: validBaseCustomer,
      items: [{ productId: "bedi-06", quantity: 1 }],
    };

    const response = await request.post("/api/orders", { data: payload });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();

    const order = body.data;
    expect(order.id).toMatch(/^ORD-\d{8}-[0-9A-F]{8}$/);
    expect(order.status).toBe("confirmed");
    expect(order.subtotal).toBe(119);
    expect(order.shippingFee).toBe(15);
    expect(order.total).toBe(134);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].productName).toBe("Precision Wireless Mouse M-03");
    expect(order.items[0].unitPrice).toBe(119);
    expect(order.items[0].quantity).toBe(1);
    expect(order.items[0].lineTotal).toBe(119);
  });

  test("2. POST /api/orders creates order with subtotal >= $150 and applies $0 free shipping", async ({
    request,
  }) => {
    // bedi-01 (Studio-01 Wireless Headphones) has price: $349, stockCount: 18
    const payload = {
      customer: validBaseCustomer,
      items: [{ productId: "bedi-01", quantity: 1 }],
    };

    const response = await request.post("/api/orders", { data: payload });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.success).toBe(true);

    const order = body.data;
    expect(order.subtotal).toBe(349);
    expect(order.shippingFee).toBe(0);
    expect(order.total).toBe(349);
  });

  test("3. POST /api/orders completely ignores client price and total tampering", async ({
    request,
  }) => {
    // Client attempts to send fake price $1 and total $1
    const tamperedPayload = {
      customer: validBaseCustomer,
      items: [
        {
          productId: "bedi-01",
          productName: "Tampered Fake Name",
          unitPrice: 1,
          quantity: 1,
          lineTotal: 1,
        },
      ],
      subtotal: 1,
      shippingFee: 0,
      total: 1,
    };

    const response = await request.post("/api/orders", { data: tamperedPayload });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.success).toBe(true);

    const order = body.data;
    // Server enforces authoritative catalog values
    expect(order.subtotal).toBe(349);
    expect(order.shippingFee).toBe(0);
    expect(order.total).toBe(349);
    expect(order.items[0].productName).toBe("Studio-01 Wireless Headphones");
    expect(order.items[0].unitPrice).toBe(349);
    expect(order.items[0].lineTotal).toBe(349);
  });

  test("4. POST /api/orders rejects unknown product IDs with 422 Unprocessable Entity", async ({
    request,
  }) => {
    const payload = {
      customer: validBaseCustomer,
      items: [{ productId: "bedi-nonexistent-product", quantity: 1 }],
    };

    const response = await request.post("/api/orders", { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNPROCESSABLE_ENTITY");
    expect(
      body.error.details.some(
        (d: ApiValidationErrorDetail) => d.code === "PRODUCT_NOT_FOUND"
      )
    ).toBe(true);
  });

  test("5. POST /api/orders rejects duplicate product lines exceeding stock with 409 Conflict", async ({
    request,
  }) => {
    // bedi-12 (Rangefinder Camera 35mm) has stockCount: 2
    const payload = {
      customer: validBaseCustomer,
      items: [
        { productId: "bedi-12", quantity: 2 },
        { productId: "bedi-12", quantity: 2 },
      ],
    };

    const response = await request.post("/api/orders", { data: payload });
    expect(response.status()).toBe(409);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("INSUFFICIENT_STOCK");
    expect(
      body.error.details.some(
        (d: ApiValidationErrorDetail) => d.code === "INSUFFICIENT_STOCK"
      )
    ).toBe(true);
  });

  test("6. POST /api/orders rejects invalid quantities with 422 Unprocessable Entity", async ({
    request,
  }) => {
    const payload = {
      customer: validBaseCustomer,
      items: [{ productId: "bedi-01", quantity: -3 }],
    };

    const response = await request.post("/api/orders", { data: payload });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(
      body.error.details.some(
        (d: ApiValidationErrorDetail) => d.code === "INVALID_INPUT"
      )
    ).toBe(true);
  });

  test("7. POST /api/orders rejects malformed JSON with 400 Bad Request", async ({
    request,
  }) => {
    const response = await request.post("/api/orders", {
      headers: { "Content-Type": "application/json" },
      data: "{ this is not valid json",
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("BAD_REQUEST");
  });

  test("8. POST /api/orders rejects missing or invalid customer fields with 400 or 422", async ({
    request,
  }) => {
    // Missing customer object entirely
    const noCustomerResponse = await request.post("/api/orders", {
      data: { items: [{ productId: "bedi-01", quantity: 1 }] },
    });
    expect(noCustomerResponse.status()).toBe(400);
    const noCustBody = await noCustomerResponse.json();
    expect(noCustBody.success).toBe(false);
    expect(noCustBody.error.code).toBe("BAD_REQUEST");

    // Invalid email format
    const badEmailResponse = await request.post("/api/orders", {
      data: {
        customer: { ...validBaseCustomer, email: "not-an-email" },
        items: [{ productId: "bedi-01", quantity: 1 }],
      },
    });
    expect(badEmailResponse.status()).toBe(422);
    const badEmailBody = await badEmailResponse.json();
    expect(
      badEmailBody.error.details.some(
        (d: ApiValidationErrorDetail) => d.field === "customer.email"
      )
    ).toBe(true);

    // Empty items array
    const emptyItemsResponse = await request.post("/api/orders", {
      data: {
        customer: validBaseCustomer,
        items: [],
      },
    });
    expect(emptyItemsResponse.status()).toBe(400);
  });

  test("9. GET /api/orders/[id] retrieves an existing order with 200 OK", async ({
    request,
  }) => {
    // 1. Create order
    const createRes = await request.post("/api/orders", {
      data: {
        customer: validBaseCustomer,
        items: [{ productId: "bedi-02", quantity: 1 }],
      },
    });
    expect(createRes.status()).toBe(201);
    const createdBody = await createRes.json();
    const orderId = createdBody.data.id;

    // 2. Retrieve order by ID
    const getRes = await request.get(`/api/orders/${orderId}`);
    expect(getRes.status()).toBe(200);

    const getBody = await getRes.json();
    expect(getBody.success).toBe(true);
    expect(getBody.data.id).toBe(orderId);
    expect(getBody.data.customer.fullName).toBe("Budi Santoso");
    expect(getBody.data.items[0].productId).toBe("bedi-02");
    expect(getBody.data.subtotal).toBe(189);
  });

  test("10. GET /api/orders/[id] returns 404 Not Found for missing order", async ({
    request,
  }) => {
    const response = await request.get("/api/orders/ORD-NONEXISTENT-9999");
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("ORDER_NOT_FOUND");
  });

  test("11. POST /api/orders handles duplicate order IDs by returning 409 Conflict", async ({
    request,
  }) => {
    const deterministicId = `ORD-DET-${Date.now()}`;
    const payload = {
      id: deterministicId,
      customer: validBaseCustomer,
      items: [{ productId: "bedi-06", quantity: 1 }],
    };

    // First creation must succeed (201)
    const firstRes = await request.post("/api/orders", { data: payload });
    expect(firstRes.status()).toBe(201);

    // Second creation with identical ID must fail (409)
    const secondRes = await request.post("/api/orders", { data: payload });
    expect(secondRes.status()).toBe(409);

    const secondBody = await secondRes.json();
    expect(secondBody.success).toBe(false);
    expect(secondBody.error.code).toBe("DUPLICATE_ORDER_ID");
  });
});
