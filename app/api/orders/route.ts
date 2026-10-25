import { NextResponse } from "next/server";
import {
  validateAndCalculateOrder,
  buildOrder,
} from "@/lib/orders/order-service";
import {
  orderRepository,
  DuplicateOrderError,
} from "@/lib/orders/order-repository";

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Format JSON pada request body tidak valid.",
          },
        },
        { status: 400 }
      );
    }

    // Validate customer, products, and recalculate all monetary totals on the server
    const calculationResult = validateAndCalculateOrder(body);

    if (!calculationResult.success) {
      const { errors } = calculationResult;

      // Determine appropriate HTTP status code
      const hasInsufficientStock = errors.some(
        (err) => err.code === "INSUFFICIENT_STOCK"
      );
      const hasBadRequest = errors.some((err) => err.code === "BAD_REQUEST");

      let statusCode = 422; // Default for semantic validation errors (INVALID_INPUT, PRODUCT_NOT_FOUND, PRODUCT_UNAVAILABLE)
      let errorCode = "UNPROCESSABLE_ENTITY";
      let errorMessage = "Data pesanan tidak dapat diproses.";

      if (hasInsufficientStock) {
        statusCode = 409;
        errorCode = "INSUFFICIENT_STOCK";
        errorMessage = "Stok produk tidak mencukupi untuk memenuhi pesanan.";
      } else if (hasBadRequest) {
        statusCode = 400;
        errorCode = "BAD_REQUEST";
        errorMessage = "Permintaan pesanan tidak valid atau data wajib belum lengkap.";
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            details: errors,
          },
        },
        { status: statusCode }
      );
    }

    // Optional client-supplied ID for deterministic idempotent/testing scenarios, otherwise auto-generated
    const rawPayload = body as { id?: unknown };
    const customId =
      typeof rawPayload.id === "string" && rawPayload.id.trim().length >= 5
        ? rawPayload.id.trim()
        : undefined;

    const order = buildOrder(calculationResult.orderData, customId);

    // Persist atomically via PostgreSQL repository
    try {
      const persistedOrder = await orderRepository.create(order);
      return NextResponse.json(
        {
          success: true,
          data: persistedOrder,
        },
        { status: 201 }
      );
    } catch (repoError: unknown) {
      if (repoError instanceof DuplicateOrderError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DUPLICATE_ORDER_ID",
              message: repoError.message,
            },
          },
          { status: 409 }
        );
      }
      throw repoError;
    }
  } catch {
    // Return safe generic 500 error without exposing stack traces or database credentials
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan internal pada server saat memproses pesanan.",
        },
      },
      { status: 500 }
    );
  }
}
