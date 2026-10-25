import {
  pgTable,
  varchar,
  integer,
  timestamp,
  pgEnum,
  serial,
  check,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 32 }).primaryKey(),
    status: orderStatusEnum("status").notNull().default("pending"),
    customerFullName: varchar("customer_full_name", { length: 255 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 50 }),
    shippingStreet: varchar("shipping_street", { length: 255 }).notNull(),
    shippingCity: varchar("shipping_city", { length: 100 }).notNull(),
    shippingPostalCode: varchar("shipping_postal_code", { length: 20 }).notNull(),
    shippingProvince: varchar("shipping_province", { length: 100 }),
    subtotal: integer("subtotal").notNull(),
    shippingFee: integer("shipping_fee").notNull(),
    total: integer("total").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("orders_subtotal_non_negative", sql`${table.subtotal} >= 0`),
    check("orders_shipping_fee_non_negative", sql`${table.shippingFee} >= 0`),
    check("orders_total_non_negative", sql`${table.total} >= 0`),
  ]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", { length: 32 })
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 50 }).notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("order_items_quantity_positive", sql`${table.quantity} > 0`),
    check("order_items_unit_price_non_negative", sql`${table.unitPrice} >= 0`),
    check("order_items_line_total_non_negative", sql`${table.lineTotal} >= 0`),
  ]
);

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export type OrderRecord = typeof orders.$inferSelect;
export type NewOrderRecord = typeof orders.$inferInsert;
export type OrderItemRecord = typeof orderItems.$inferSelect;
export type NewOrderItemRecord = typeof orderItems.$inferInsert;
