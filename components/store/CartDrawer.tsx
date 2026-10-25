"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CartItem } from "@/types/product";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout?: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
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
      aria-label="Panel Keranjang Belanja"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2523]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col border-l border-[#E8E4DC]">
          {/* Header */}
          <div className="p-6 bg-[#FAF6F0] border-b border-[#E8E4DC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-lg tracking-tight text-[#2C2523]">
                Keranjang Belanja
              </h2>
              <span className="px-2.5 py-0.5 text-xs text-[#536859] bg-[#EFECE6] rounded-full font-medium">
                {totalItemCount} {totalItemCount === 1 ? "produk" : "produk"}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup keranjang"
              className="p-2 rounded-full text-[#6B6059] hover:text-[#2C2523] hover:bg-[#EFECE6] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Shipping Meter */}
          <div className="bg-[#EFECE6] px-6 py-4 border-b border-[#E8E4DC] text-xs">
            <div className="flex justify-between text-[#6B6059] mb-2">
              <span>
                {amountToFreeShipping === 0 ? (
                  <span className="text-[#536859] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#536859]" />
                    Gratis ongkos kirim aktif (pesanan di atas $150)
                  </span>
                ) : (
                  <span>
                    Tambah <strong className="text-[#2C2523] font-semibold">${amountToFreeShipping}</strong> lagi untuk gratis ongkir
                  </span>
                )}
              </span>
              <span className="text-[#9C9189] text-[11px] font-medium">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#DCD6CD] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#536859] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#9C9189] mb-3.5">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-serif text-base text-[#2C2523]">
                  Keranjang belanja kosong
                </h3>
                <p className="mt-1.5 text-xs text-[#6B6059] max-w-xs leading-relaxed">
                  Pilih produk dari katalog kami untuk mulai menambahkan perangkat ke keranjang belanja.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 text-xs font-medium rounded-full bg-[#4B5842] text-[#FAF6F0] hover:bg-[#3D4836] transition-colors shadow-2xs"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-white border border-[#E8E4DC]"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#FAF6F0] shrink-0 border border-[#E8E4DC]">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#9C9189]">
                        {item.product.category.slice(0, 3)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-xs text-[#2C2523] leading-snug truncate">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          aria-label={`Hapus ${item.product.name} dari keranjang`}
                          className="text-[#9C9189] hover:text-[#2C2523] p-0.5 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="text-[11px] text-[#6B6059] mt-0.5">
                        ${item.product.price} per unit
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center rounded-full border border-[#DCD6CD] bg-[#FAF6F0]">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Kurangi kuantitas"
                          className="px-2.5 py-0.5 text-xs text-[#6B6059] hover:text-[#2C2523]"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-medium text-[#2C2523]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stockCount}
                          aria-label="Tambah kuantitas"
                          className="px-2.5 py-0.5 text-xs text-[#6B6059] hover:text-[#2C2523] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-[#2C2523]">
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
            <div className="p-6 border-t border-[#E8E4DC] bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-[#6B6059]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2C2523]">
                    ${subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimasi Pengiriman</span>
                  <span>{subtotal >= 150 ? "Gratis" : "$15"}</span>
                </div>
                <div className="flex justify-between text-sm font-serif text-[#2C2523] pt-2.5 border-t border-[#E8E4DC]">
                  <span>Total</span>
                  <span className="font-sans font-semibold">${subtotal >= 150 ? subtotal : subtotal + 15}</span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="px-4 py-2.5 rounded-full border border-[#DCD6CD] bg-[#FAF6F0] text-[#6B6059] hover:bg-[#EFECE6] hover:text-[#2C2523] text-xs font-medium transition-colors"
                >
                  Kosongkan
                </button>
                <button
                  type="button"
                  onClick={onCheckout}
                  aria-label="Lanjut ke Pembayaran"
                  className="flex-1 py-2.5 rounded-full bg-[#4B5842] text-[#FAF6F0] text-xs font-medium hover:bg-[#3D4836] transition-colors text-center shadow-2xs"
                >
                  Lanjut ke Pembayaran
                </button>
              </div>

              <p className="text-[11px] text-center text-[#9C9189]">
                Pesanan resmi diproses oleh server • Pembayaran disimulasikan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
