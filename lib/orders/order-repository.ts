import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  OrderRecord,
  OrderItemRecord,
} from "@/lib/db/schema";
import { Order, OrderItem, OrderStatus } from "@/types/order";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
}

export class DuplicateOrderError extends Error {
  constructor(public readonly orderId: string) {
    super(`Pesanan dengan ID "${orderId}" sudah terdaftar.`);
    this.name = "DuplicateOrderError";
  }
}

/**
 * Maps a database record (with joined items) into the domain Order entity.
 */
export function mapOrderRecordToOrder(
  record: OrderRecord & { items: OrderItemRecord[] }
): Order {
  const items: OrderItem[] = record.items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    lineTotal: item.lineTotal,
  }));

  return {
    id: record.id,
    status: record.status as OrderStatus,
    customer: {
      fullName: record.customerFullName,
      email: record.customerEmail,
      phone: record.customerPhone ?? undefined,
      shippingAddress: {
        street: record.shippingStreet,
        city: record.shippingCity,
        postalCode: record.shippingPostalCode,
        province: record.shippingProvince ?? undefined,
      },
    },
    subtotal: record.subtotal,
    shippingFee: record.shippingFee,
    total: record.total,
    items,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export class PostgresOrderRepository implements IOrderRepository {
  constructor(private readonly database = db) {}

  /**
   * Atomically persists an order and all of its line items within a single transaction.
   * If any step fails, the entire transaction rolls back cleanly.
   */
  async create(order: Order): Promise<Order> {
    try {
      await this.database.transaction(async (tx) => {
        // 1. Insert order header
        await tx.insert(orders).values({
          id: order.id,
          status: order.status,
          customerFullName: order.customer.fullName,
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone ?? null,
          shippingStreet: order.customer.shippingAddress.street,
          shippingCity: order.customer.shippingAddress.city,
          shippingPostalCode: order.customer.shippingAddress.postalCode,
          shippingProvince: order.customer.shippingAddress.province ?? null,
          subtotal: order.subtotal,
          shippingFee: order.shippingFee,
          total: order.total,
          createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
          updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date(),
        });

        // 2. Insert order items
        if (order.items && order.items.length > 0) {
          await tx.insert(orderItems).values(
            order.items.map((item) => ({
              orderId: order.id,
              productId: item.productId,
              productName: item.productName,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
              createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
            }))
          );
        }
      });

      return order;
    } catch (error: unknown) {
      const err = error as {
        code?: string;
        constraint?: string;
        message?: string;
        cause?: {
          code?: string;
          constraint?: string;
          constraint_name?: string;
          message?: string;
        };
      };

      const code = err?.code || err?.cause?.code;
      const constraint =
        err?.constraint || err?.cause?.constraint || err?.cause?.constraint_name;
      const message = `${err?.message || ""} ${err?.cause?.message || ""}`;

      // PostgreSQL error code 23505 is unique_violation
      if (
        code === "23505" ||
        constraint === "orders_pkey" ||
        message.includes("orders_pkey") ||
        message.includes("duplicate key")
      ) {
        throw new DuplicateOrderError(order.id);
      }
      throw error;
    }
  }

  /**
   * Retrieves an order and its associated line items by order ID.
   * Returns null if no order is found.
   */
  async findById(id: string): Promise<Order | null> {
    const orderRecord = await this.database.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: true,
      },
    });

    if (!orderRecord) {
      return null;
    }

    return mapOrderRecordToOrder(orderRecord);
  }
}

export const orderRepository = new PostgresOrderRepository();
