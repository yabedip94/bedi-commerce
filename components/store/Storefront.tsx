"use client";

import React, { useState, useMemo, useRef } from "react";
import { Product, CartItem, ProductCategory } from "@/types/product";
import { SAMPLE_PRODUCTS, PRODUCT_CATEGORIES } from "@/data/products";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { ProductCard } from "./ProductCard";
import { CartDrawer } from "./CartDrawer";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export function Storefront() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Semua" | ProductCategory>("Semua");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const catalogRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stockCount) }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    // Show toast
    setToastMessage(`"${product.name}" ditambahkan ke keranjang`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Scroll to catalog helper
  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 400);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...SAMPLE_PRODUCTS];

    // Category filter
    if (selectedCategory !== "Semua") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // In-stock only
    if (inStockOnly) {
      result = result.filter((p) => p.inStock && p.stockCount > 0);
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        // Keep deterministic order
        break;
    }

    return result;
  }, [selectedCategory, inStockOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setInStockOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2C2523] transition-colors overflow-x-hidden">
      {/* Global Header */}
      <Header
        cartCount={totalCartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Hero Section */}
      <Hero
        onShopClick={scrollToCatalog}
        onSelectCategory={setSelectedCategory}
      />

      {/* Product & Service Characteristics Strip */}
      <section id="informasi" className="border-b border-[#E3DED6] bg-[#EFECE6]/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#6E5845] border border-[#E3DED6] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-medium text-[#2C2523]">
                  Spesifikasi Terbuka
                </h4>
                <p className="text-[11px] text-[#6B6059]">Rincian teknis lengkap setiap unit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#6E5845] border border-[#E3DED6] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-medium text-[#2C2523]">
                  Pengecekan Fungsi
                </h4>
                <p className="text-[11px] text-[#6B6059]">Uji operasional sebelum pengemasan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#6E5845] border border-[#E3DED6] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-medium text-[#2C2523]">
                  Pengemasan Rapi
                </h4>
                <p className="text-[11px] text-[#6B6059]">Pelindung ganda untuk keamanan barang</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#6E5845] border border-[#E3DED6] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-medium text-[#2C2523]">
                  Panduan Perangkat
                </h4>
                <p className="text-[11px] text-[#6B6059]">Bantuan instruksi penyiapan alat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main ref={catalogRef} id="catalog" className="flex-1 py-14 lg:py-20 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header & In-Page Search Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E3DED6]">
            <div>
              <span className="text-xs text-[#998D84] font-normal block mb-1">
                Katalog Produk
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#2C2523]">
                Perangkat Kerja &amp; Audio
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#6B6059]">
                Menampilkan {filteredProducts.length} dari {SAMPLE_PRODUCTS.length} produk pilihan
              </p>
            </div>

            {/* In-Catalog Search Input */}
            <div className="w-full md:w-80 relative">
              <label htmlFor="product-search" className="sr-only">
                Cari produk
              </label>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  id="product-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari audio, keyboard, monitor, lampu meja..."
                  className="w-full rounded-full border border-[#DED8CE] bg-white px-4 py-2.5 pl-10 pr-9 text-xs text-[#2C2523] placeholder-[#998D84] focus:outline-none focus:ring-1 focus:ring-[#6E5845]"
                />
                <svg
                  className="w-4 h-4 absolute left-3.5 top-3 text-[#998D84]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Hapus pencarian"
                    className="absolute right-3 top-2.5 text-[#998D84] hover:text-[#2C2523] p-0.5"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Tabs & Secondary Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category tabs */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none"
              role="tablist"
              aria-label="Filter kategori produk"
            >
              {PRODUCT_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === "Semua"
                    ? SAMPLE_PRODUCTS.length
                    : SAMPLE_PRODUCTS.filter((p) => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                      isSelected
                        ? "bg-[#4B5842] text-[#FAF6F0] shadow-2xs"
                        : "bg-white text-[#6B6059] hover:bg-[#EFECE6] border border-[#E3DED6]"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono px-1 rounded ${
                        isSelected
                          ? "text-[#DED8CE]"
                          : "text-[#998D84]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* In-Stock & Sorting Controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* In-Stock Toggle */}
              <label className="inline-flex items-center gap-2 font-normal text-[#6B6059] cursor-pointer select-none bg-white px-3.5 py-1.5 rounded-full border border-[#E3DED6]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#DED8CE] text-[#2C2523] focus:ring-[#6E5845] w-3.5 h-3.5"
                />
                <span>Hanya stok tersedia</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E3DED6]">
                <span className="text-[#998D84]">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Urutkan produk"
                  className="bg-transparent text-xs font-medium text-[#2C2523] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Rekomendasi</option>
                  <option value="price-asc">Harga: Rendah ke Tinggi</option>
                  <option value="price-desc">Harga: Tinggi ke Rendah</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>

              {/* Reset if active filters */}
              {(searchQuery || selectedCategory !== "Semua" || inStockOnly || sortBy !== "featured") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[#6B6059] hover:text-[#2C2523] underline px-1 py-1"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Active Search Query Indicator */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-[#6B6059] bg-[#EFECE6] px-4 py-2 rounded-full border border-[#E3DED6]">
              <span>
                Hasil pencarian untuk &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="ml-auto font-medium text-[#2C2523] hover:underline"
              >
                Hapus
              </button>
            </div>
          )}

          {/* Product Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="my-16 flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-[#DED8CE] bg-white/60">
              <div className="w-12 h-12 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#998D84] mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-normal text-[#2C2523]">
                Produk tidak ditemukan
              </h3>
              <p className="mt-1 text-xs text-[#6B6059] max-w-sm">
                Tidak ada produk yang cocok dengan pencarian Anda. Silakan coba kata kunci lain atau reset filter yang sedang aktif.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 px-5 py-2.5 rounded-full bg-[#4B5842] text-[#FAF6F0] font-medium text-xs hover:bg-[#3D4836] transition-colors shadow-2xs"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Brand Identity & Practical Mission Section */}
      <section id="tentang" className="py-16 border-t border-[#E3DED6] bg-[#EFECE6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs text-[#998D84] font-normal">
              Tentang Bedi Commerce
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#2C2523]">
              Fungsionalitas tanpa komplikasi.
            </h2>
            <p className="text-[#6B6059] leading-relaxed text-xs sm:text-sm">
              Bedi Commerce mengkurasi perangkat elektronik meja kerja, audio berkualitas, dan aksesoris harian yang mengutamakan fungsi nyata, material awet, serta spesifikasi yang jelas untuk menunjang produktivitas setiap hari.
            </p>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-[#E3DED6] bg-[#FAF6F0] py-12 text-[#6B6059] text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4B5842] text-[#FAF6F0] font-serif text-xs font-medium">
                  BC
                </div>
                <span className="font-serif font-normal text-[#2C2523] text-sm">
                  Bedi Commerce
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#6B6059]">
                Toko kurasi perangkat audio, elektronik, dan perlengkapan meja kerja fungsional.
              </p>
            </div>

            <div>
              <h5 className="font-medium text-[#2C2523] mb-2.5 text-xs">
                Kategori Produk
              </h5>
              <ul className="space-y-1.5 text-xs">
                {PRODUCT_CATEGORIES.filter((c) => c !== "Semua").map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c);
                        scrollToCatalog();
                      }}
                      className="hover:text-[#2C2523] transition-colors"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-[#2C2523] mb-2.5 text-xs">
                Informasi &amp; Bantuan
              </h5>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#informasi" className="hover:text-[#2C2523]">Spesifikasi Terbuka</a></li>
                <li><a href="#informasi" className="hover:text-[#2C2523]">Pengecekan Fungsi</a></li>
                <li><a href="#informasi" className="hover:text-[#2C2523]">Pengemasan Barang</a></li>
                <li><a href="#tentang" className="hover:text-[#2C2523]">Tentang Toko</a></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-medium text-[#2C2523] text-xs">
                Pembaruan Katalog
              </h5>
              <p className="text-xs text-[#6B6059]">
                Dapatkan pemberitahuan berkala saat produk baru atau stok ulang tersedia.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Terima kasih telah mendaftarkan email Anda untuk pembaruan katalog Bedi Commerce.");
                }}
                className="flex gap-2"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Alamat Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Masukkan email Anda"
                  className="w-full px-3.5 py-2 rounded-full border border-[#DED8CE] bg-white text-xs text-[#2C2523] placeholder-[#998D84] focus:outline-none focus:ring-1 focus:ring-[#6E5845]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#4B5842] text-[#FAF6F0] font-medium text-xs hover:bg-[#3D4836] transition-colors shrink-0 shadow-2xs"
                >
                  Daftar
                </button>
              </form>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E3DED6] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#998D84]">
            <p>
              &copy; 2026 Bedi Commerce. Katalog demonstrasi purwarupa antarmuka e-commerce.
            </p>
            <div className="flex gap-4">
              <span>Kebijakan Privasi</span>
              <span>Syarat &amp; Ketentuan</span>
              <span>Aksesibilitas</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#3F4B37] text-[#FAF6F0] shadow-md border border-[#4B5842] animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#536859]" />
          <span className="text-xs font-normal">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-xs font-medium text-[#FAF6F0] underline underline-offset-2"
          >
            Lihat Keranjang ({totalCartCount})
          </button>
        </div>
      )}
    </div>
  );
}
