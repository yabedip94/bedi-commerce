"use client";

import React, { useState, useEffect } from "react";
import { CartItem } from "@/types/product";
import { Order } from "@/types/order";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}: CheckoutModalProps) {
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState("");

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Close on Escape when not submitting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Lock body scroll while open
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

  const handleClose = () => {
    if (isSubmitting) return;
    setCompletedOrder(null);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  const subtotalPreview = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shippingFeePreview = subtotalPreview >= 150 ? 0 : 15;
  const totalPreview = subtotalPreview + shippingFeePreview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    // Client-side quick validation for required fields
    if (
      !fullName.trim() ||
      !email.trim() ||
      !street.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      setErrorMessage("Mohon lengkapi seluruh field wajib dengan benar.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Format email tidak valid. Masukkan alamat email yang benar.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Zero-trust: Submit only customer info and product quantities.
      // Prices and totals are never sent from browser.
      const payload = {
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          shippingAddress: {
            street: street.trim(),
            city: city.trim(),
            postalCode: postalCode.trim(),
            province: province.trim() || undefined,
          },
        },
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const message =
          data.error?.message ||
          "Gagal memproses pesanan. Silakan periksa kembali data Anda.";
        setErrorMessage(message);
        setIsSubmitting(false);
        return;
      }

      // Successful order creation
      const createdOrder: Order = data.data;
      setCompletedOrder(createdOrder);
      setIsSubmitting(false);

      // Trigger cart clearing only after successful creation confirmed by server
      onOrderSuccess(createdOrder);
    } catch {
      setErrorMessage(
        "Terjadi kendala jaringan saat memproses pesanan. Silakan coba lagi."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Modal Checkout Pesanan"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2523]/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-2xl bg-[#FAF6F0] rounded-2xl shadow-2xl border border-[#E8E4DC] text-left overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-6 py-4 bg-[#FAF6F0] border-b border-[#E8E4DC] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#4B5842]" />
              <h2 className="font-serif text-lg text-[#2C2523]">
                {completedOrder ? "Konfirmasi Pesanan" : "Checkout Pesanan"}
              </h2>
            </div>
            {!isSubmitting && (
              <button
                type="button"
                onClick={handleClose}
                aria-label="Tutup modal checkout"
                className="p-1.5 rounded-full text-[#6B6059] hover:text-[#2C2523] hover:bg-[#EFECE6] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Success View */}
          {completedOrder ? (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#4B5842]/15 text-[#4B5842] flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-[#2C2523]">
                  Pesanan Berhasil Dibuat!
                </h3>
                <p className="text-xs text-[#6B6059] max-w-sm">
                  Terima kasih, pesanan Anda telah tersimpan secara resmi di sistem
                  Bedi Commerce.
                </p>
              </div>

              {/* Order Details Badge */}
              <div className="bg-[#EFECE6] p-4 rounded-xl border border-[#E0DAD0] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCD6CD] pb-3 text-xs">
                  <div>
                    <span className="text-[#6B6059] block">Nomor Pesanan</span>
                    <span className="font-mono font-bold text-sm text-[#2C2523]" data-testid="order-id">
                      {completedOrder.id}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#4B5842] text-[#FAF6F0] text-[11px] font-medium capitalize">
                    {completedOrder.status === "confirmed"
                      ? "Dikonfirmasi"
                      : completedOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#6B6059] block">Pemesan</span>
                    <strong className="text-[#2C2523]">
                      {completedOrder.customer.fullName}
                    </strong>
                    <span className="text-[#6B6059] block">
                      {completedOrder.customer.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B6059] block">Alamat Pengiriman</span>
                    <span className="text-[#2C2523] block">
                      {completedOrder.customer.shippingAddress.street}
                    </span>
                    <span className="text-[#6B6059] block">
                      {completedOrder.customer.shippingAddress.city},{" "}
                      {completedOrder.customer.shippingAddress.postalCode}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="pt-2 border-t border-[#DCD6CD] space-y-1.5 text-xs">
                  <span className="text-[#6B6059] block font-medium">
                    Item Dipesan ({completedOrder.items.length})
                  </span>
                  {completedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-[#2C2523]"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-medium">${item.lineTotal}</span>
                    </div>
                  ))}
                </div>

                {/* Authoritative Totals */}
                <div className="pt-3 border-t border-[#DCD6CD] space-y-1 text-xs">
                  <div className="flex justify-between text-[#6B6059]">
                    <span>Subtotal</span>
                    <span>${completedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6059]">
                    <span>Biaya Pengiriman</span>
                    <span>
                      {completedOrder.shippingFee === 0
                        ? "Gratis"
                        : `$${completedOrder.shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-serif text-sm font-semibold text-[#2C2523] pt-1">
                    <span>Total Pembayaran</span>
                    <span>${completedOrder.total}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-full bg-[#4B5842] text-[#FAF6F0] text-xs font-medium hover:bg-[#3D4836] transition-colors text-center shadow-2xs"
                >
                  Kembali ke Katalog
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-[#B86B53]/15 border border-[#B86B53]/30 text-[#A85842] text-xs flex items-center gap-2.5"
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B6059]">
                  Data Pelanggan & Pengiriman
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-fullname"
                      className="text-xs font-medium text-[#2C2523]"
                    >
                      Nama Lengkap <span className="text-[#A85842]">*</span>
                    </label>
                    <input
                      id="checkout-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCD6CD] text-xs text-[#2C2523] focus:outline-none focus:border-[#4B5842]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-email"
                      className="text-xs font-medium text-[#2C2523]"
                    >
                      Alamat Email <span className="text-[#A85842]">*</span>
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="budi@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCD6CD] text-xs text-[#2C2523] focus:outline-none focus:border-[#4B5842]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="checkout-phone"
                    className="text-xs font-medium text-[#2C2523]"
                  >
                    Nomor Telepon{" "}
                    <span className="text-[#9C9189] font-normal">(opsional)</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCD6CD] text-xs text-[#2C2523] focus:outline-none focus:border-[#4B5842]"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="checkout-street"
                    className="text-xs font-medium text-[#2C2523]"
                  >
                    Alamat Jalan <span className="text-[#A85842]">*</span>
                  </label>
                  <input
                    id="checkout-street"
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, gedung"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCD6CD] text-xs text-[#2C2523] focus:outline-none focus:border-[#4B5842]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-city"
                      className="text-xs font-medium text-[#2C2523]"
                    >
                      Kota / Kabupaten <span className="text-[#A85842]">*</span>
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Contoh: Jakarta Selatan"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCD6CD] text-xs text-[#2C2523] focus:outline-none focus:border-[#4B5842]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-postal"
                      className="text-xs font-medium text-[#2C2523]"
                    >
                      Kode Pos <span className="text-[#A85842]">*</span>
                    </label>
                    <input
                      id="checkout-postal"
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Contoh: 12190"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCD6CD] text-xs text-[#2C2523] focus:outline-none focus:border-[#4B5842]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="checkout-province"
                      className="text-xs font-medium text-[#2C2523]"
                    >
                      Provinsi{" "}
                      <span className="text-[#9C9189] font-normal">(opsional)</span>
                    </label>
                    <input
                      id="checkout-province"
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="DKI Jakarta"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCD6CD] text-xs text-[#2C2523] focus:outline-none focus:border-[#4B5842]"
                    />
                  </div>
                </div>
              </div>

              {/* Order Review Summary */}
              <div className="bg-[#EFECE6] p-4 rounded-xl border border-[#E0DAD0] space-y-2.5">
                <h4 className="text-xs font-medium text-[#2C2523]">
                  Ringkasan Pesanan ({items.length} jenis produk)
                </h4>

                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center text-[#2C2523]"
                    >
                      <span className="truncate pr-2">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium shrink-0">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#DCD6CD] space-y-1 text-xs text-[#6B6059]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#2C2523] font-medium">
                      ${subtotalPreview}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi Pengiriman</span>
                    <span>
                      {shippingFeePreview === 0
                        ? "Gratis"
                        : `$${shippingFeePreview}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-serif text-sm font-semibold text-[#2C2523] pt-1 border-t border-[#DCD6CD]">
                    <span>Total Estimasi</span>
                    <span>${totalPreview}</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-full border border-[#DCD6CD] bg-[#FAF6F0] text-[#6B6059] hover:bg-[#EFECE6] hover:text-[#2C2523] text-xs font-medium transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="flex-1 py-2.5 rounded-full bg-[#4B5842] text-[#FAF6F0] text-xs font-medium hover:bg-[#3D4836] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center shadow-2xs flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      <span>Memproses Pesanan...</span>
                    </>
                  ) : (
                    "Konfirmasi & Buat Pesanan"
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-[#9C9189]">
                Pesanan akan diproses dan diverifikasi oleh server Bedi Commerce.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
