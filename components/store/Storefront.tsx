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
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");
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
    setToastMessage(`Added "${product.name}" to cart`);
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
    if (selectedCategory !== "All") {
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
    setSelectedCategory("All");
    setInStockOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 dark:bg-black dark:text-zinc-100 transition-colors">
      {/* Top Banner */}
      <div className="bg-zinc-950 text-white text-xs py-2 px-4 text-center font-medium border-b border-zinc-800">
        <span>
          Spring Launch: Enjoy free worldwide carbon-neutral delivery on orders over $150.
        </span>
      </div>

      {/* Global Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Hero Section */}
      <Hero onShopClick={scrollToCatalog} />

      {/* Trust & Guarantee Banner */}
      <section id="guarantee" className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  2-Year Warranty
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Complete hardware protection</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  30-Day Trial
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Hassle-free return policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Global Shipping
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Insured express couriers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Direct Support
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Real engineers & designers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main ref={catalogRef} id="catalog" className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header & Search Bar Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold mb-1">
                Explore the Collection
              </div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
                Curated Storefront
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Showing {filteredProducts.length} of {SAMPLE_PRODUCTS.length} curated instruments & essentials
              </p>
            </div>

            {/* Search Input Control */}
            <div className="w-full md:w-80 relative">
              <label htmlFor="product-search" className="sr-only">
                Search products by title, feature, or keyword
              </label>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  id="product-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search audio, keyboard, desk..."
                  className="w-full rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 pl-10 pr-10 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm"
                />
                <svg
                  className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search input"
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Pills & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category tabs */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none"
              role="tablist"
              aria-label="Filter products by category"
            >
              {PRODUCT_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === "All"
                    ? SAMPLE_PRODUCTS.length
                    : SAMPLE_PRODUCTS.filter((p) => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isSelected
                        ? "bg-zinc-950 text-white shadow-md dark:bg-white dark:text-zinc-950"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isSelected
                          ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-950"
                          : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Secondary Controls: In Stock & Sorting */}
            <div className="flex flex-wrap items-center gap-3">
              {/* In-Stock Toggle */}
              <label className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none bg-zinc-100 dark:bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>In-Stock Only</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-[11px] font-medium text-zinc-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort products"
                  className="bg-transparent text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="dark:bg-zinc-900">Featured</option>
                  <option value="price-asc" className="dark:bg-zinc-900">Price: Low to High</option>
                  <option value="price-desc" className="dark:bg-zinc-900">Price: High to Low</option>
                  <option value="rating" className="dark:bg-zinc-900">Highest Rated</option>
                </select>
              </div>

              {/* Reset if active filters */}
              {(searchQuery || selectedCategory !== "All" || inStockOnly || sortBy !== "featured") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline px-2 py-1"
                >
                  Reset all
                </button>
              )}
            </div>
          </div>

          {/* Active Search & Filter Indicators */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
              <span>
                Search results for: <strong className="text-zinc-900 dark:text-white">&quot;{searchQuery}&quot;</strong>
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="ml-auto text-amber-700 dark:text-amber-400 font-bold hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Product Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="my-16 flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <div className="w-16 h-16 rounded-2xl bg-zinc-200 dark:bg-zinc-850 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                No matching products found
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
                We couldn&apos;t find anything matching your search criteria. Try checking for spelling errors, clearing your search query, or browsing other categories.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
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

      {/* Philosophy Section */}
      <section id="about" className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
              The Bedi Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              Minimalist Form. Uncompromising Engineering.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              At Bedi Commerce, we reject the cycle of disposable consumer tech. Every product in our catalog is chosen for acoustic superiority, tactile precision, and sustainable industrial design. We build tools that inspire focus and endure for decades.
            </p>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-14 text-zinc-600 dark:text-zinc-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white font-mono text-xs font-black dark:bg-white dark:text-zinc-950">
                  BC
                </div>
                <span className="font-bold text-zinc-950 dark:text-white text-sm">
                  Bedi Commerce
                </span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Premium hardware, workspace instruments, and minimal daily gear for intentional living.
              </p>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3 text-[11px]">
                Product Categories
              </h5>
              <ul className="space-y-2">
                {PRODUCT_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c);
                        scrollToCatalog();
                      }}
                      className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3 text-[11px]">
                Customer Care
              </h5>
              <ul className="space-y-2">
                <li><a href="#guarantee" className="hover:text-zinc-950 dark:hover:text-white">Shipping & Returns</a></li>
                <li><a href="#guarantee" className="hover:text-zinc-950 dark:hover:text-white">2-Year Limited Warranty</a></li>
                <li><a href="#guarantee" className="hover:text-zinc-950 dark:hover:text-white">Order Tracking (Demo)</a></li>
                <li><a href="#about" className="hover:text-zinc-950 dark:hover:text-white">Sustainability Report</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3 text-[11px]">
                Direct Dispatch Dispatch
              </h5>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Receive private access to limited batch production runs and new acoustic releases.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing to Bedi Commerce updates.");
                }}
                className="flex gap-2"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              © 2026 Bedi Commerce, Inc. All rights reserved. Crafted with Next.js App Router &amp; Tailwind CSS.
            </p>
            <div className="flex gap-4 text-[11px] text-zinc-600 dark:text-zinc-400">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Accessibility</span>
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

      {/* Floating Action / Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-950 text-white shadow-2xl border border-zinc-800 dark:bg-white dark:text-zinc-950 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-xs font-bold text-amber-400 underline dark:text-amber-600"
          >
            View Cart ({totalCartCount})
          </button>
        </div>
      )}
    </div>
  );
}
