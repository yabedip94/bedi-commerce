import { NextResponse } from "next/server";
import { orderRepository } from "@/lib/orders/order-repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string" || id.trim() === "" || id.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ORDER_ID",
            message: "Parameter ID pesanan tidak valid.",
          },
        },
        { status: 400 }
      );
    }

    const trimmedId = id.trim();
    const order = await orderRepository.findById(trimmedId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ORDER_NOT_FOUND",
            message: `Pesanan dengan ID "${trimmedId}" tidak ditemukan.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan internal pada server saat mengambil data pesanan.",
        },
      },
      { status: 500 }
    );
  }
}
