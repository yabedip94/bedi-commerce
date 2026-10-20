"use client";

import React, { useEffect } from "react";
import { CartItem } from "@/types/product";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 shadow-2xl flex flex-col border-l border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Your Shopping Cart
              </h2>
              <span className="px-2 py-0.5 text-xs font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 rounded-full">
                {totalItemCount}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Shipping Meter */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border-b border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="flex justify-between font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              <span>
                {amountToFreeShipping === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ Free Worldwide Delivery unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-zinc-900 dark:text-white">${amountToFreeShipping}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-zinc-500">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  progressToFreeShipping >= 100 ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                  Your cart is empty
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                  Discover our precision-crafted hardware, ergonomic workspace essentials, and minimalist apparel.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.product.visualTheme.gradient} bg-zinc-900 flex items-center justify-center shrink-0 border border-white/10`}
                  >
                    <span className="text-[10px] uppercase font-mono font-bold text-white/80">
                      {item.product.category.slice(0, 3)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        aria-label={`Remove ${item.product.name} from cart`}
                        className="text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 p-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      ${item.product.price} each
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity stepper */}
                      <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="px-2 py-0.5 text-xs text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold text-zinc-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stockCount}
                          aria-label="Increase quantity"
                          className="px-2 py-0.5 text-xs text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm font-bold text-zinc-900 dark:text-white">
                        ${item.product.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    ${subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Shipping estimate</span>
                  <span>{subtotal >= 150 ? "FREE" : "$15"}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span>Total</span>
                  <span>${subtotal >= 150 ? subtotal : subtotal + 15}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="px-3 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled
                  title="Checkout will be integrated in a future release"
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs transition-all dark:bg-white dark:text-zinc-900 opacity-90 cursor-not-allowed text-center"
                >
                  Checkout (Milestone Preview)
                </button>
              </div>

              <p className="text-[11px] text-center text-zinc-600 dark:text-zinc-400">
                🔒 Guaranteed 256-bit encrypted simulated checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
