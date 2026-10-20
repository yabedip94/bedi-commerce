"use client";

import React, { useState } from "react";
import { ProductCategory } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/data/products";

interface HeaderProps {
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onScrollToCatalog: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: "Semua" | ProductCategory;
  onSelectCategory: (category: "Semua" | ProductCategory) => void;
}

export function Header({
  cartCount,
  cartSubtotal,
  onOpenCart,
  onScrollToCatalog,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScrollToCatalog();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E3DED6] bg-[#FAF6F0]/95 backdrop-blur-md transition-colors">
      {/* Top Utility Bar */}
      <div className="border-b border-[#E3DED6] bg-[#EFECE6] py-2 px-4 text-xs text-[#6B6059]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-medium text-[#2C2523]">
              Bedi Commerce
            </span>
            <span className="hidden sm:inline text-[#B5ABA1]">·</span>
            <span className="hidden sm:inline">
              Katalog demonstrasi perangkat kerja dan audio fungsional
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <a href="#informasi" className="hover:text-[#4B5842] transition-colors">
              Spesifikasi Model
            </a>
            <span className="text-[#B5ABA1]">·</span>
            <a href="#tentang" className="hover:text-[#4B5842] transition-colors">
              Purwarupa Toko
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 sm:gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <button
          type="button"
          onClick={onScrollToCatalog}
          className="group flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none shrink-0"
          aria-label="Beranda Bedi Commerce"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-[#4B5842] text-[#FAF6F0] transition-transform group-hover:scale-105">
            <span className="font-serif text-xs sm:text-sm font-medium tracking-tight">
              BC
            </span>
          </div>
          <div>
            <span className="font-serif text-lg sm:text-xl font-normal tracking-tight text-[#2C2523] block leading-none">
              Bedi Commerce
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#998D84] block mt-1 font-normal">
              Perlengkapan Audio &amp; Kerja
            </span>
          </div>
        </button>

        {/* Integrated Search Bar with Category Selector */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-lg items-center rounded-full border border-[#DED8CE] bg-white transition-all focus-within:border-[#6E5845] focus-within:ring-1 focus-within:ring-[#6E5845] overflow-hidden"
        >
          {/* Category Dropdown */}
          <div className="relative border-r border-[#E3DED6] bg-[#FAF6F0] px-4 py-2 shrink-0">
            <label htmlFor="header-category-select" className="sr-only">
              Pilih kategori
            </label>
            <select
              id="header-category-select"
              value={selectedCategory}
              onChange={(e) =>
                onSelectCategory(e.target.value as "Semua" | ProductCategory)
              }
              className="bg-transparent text-xs text-[#6B6059] font-medium focus:outline-none cursor-pointer pr-3"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Semua" ? "Semua Kategori" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari audio, keyboard, monitor, lampu meja..."
              className="w-full bg-transparent px-3.5 py-2 text-xs text-[#2C2523] placeholder-[#998D84] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-2 top-2 text-[#998D84] hover:text-[#2C2523] p-0.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Action Icon */}
          <button
            type="submit"
            aria-label="Cari produk"
            className="px-4 py-2 text-[#6E5845] hover:text-[#2C2523] transition-colors shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Right Navigation & Cart */}
        <div className="flex items-center gap-2 sm:gap-5 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 text-xs text-[#6B6059]">
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="hover:text-[#2C2523] transition-colors font-medium"
            >
              Katalog
            </button>
            <a
              href="#informasi"
              className="hover:text-[#2C2523] transition-colors"
            >
              Spesifikasi
            </a>
            <a
              href="#tentang"
              className="hover:text-[#2C2523] transition-colors"
            >
              Tentang
            </a>
          </nav>

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Buka keranjang dengan ${cartCount} produk, total $${cartSubtotal}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#4B5842] px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-medium text-[#FAF6F0] hover:bg-[#3D4836] transition-all active:scale-98 shadow-2xs"
          >
            <svg
              className="w-3.5 h-3.5 text-[#EFECE6]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="hidden sm:inline">Keranjang</span>
            <span className="text-[#DED8CE] font-mono text-[11px]">
              ({cartCount})
            </span>
            <span className="hidden sm:inline text-[#8C8075]">·</span>
            <span className="font-medium text-[#FAF6F0]">
              ${cartSubtotal}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
            className="md:hidden p-2 rounded-lg text-[#2C2523] hover:bg-[#EFECE6] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search Row */}
      <div className="md:hidden border-t border-[#E3DED6] px-4 py-2.5 bg-[#EFECE6]">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari audio, keyboard, monitor..."
            className="flex-1 rounded-full border border-[#DED8CE] bg-white px-3.5 py-2 text-xs text-[#2C2523] placeholder-[#998D84] focus:outline-none focus:ring-1 focus:ring-[#6E5845]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-[#4B5842] text-[#FAF6F0] font-medium text-xs hover:bg-[#3D4836] transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E3DED6] bg-[#FAF6F0] px-6 py-4 space-y-3">
          <div className="text-xs font-medium text-[#998D84]">
            Kategori Produk
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                  onScrollToCatalog();
                }}
                className={`text-left py-2 px-3 rounded-lg text-xs font-medium ${
                  selectedCategory === cat
                    ? "bg-[#4B5842] text-[#FAF6F0]"
                    : "text-[#6B6059] hover:bg-[#EFECE6]"
                }`}
              >
                {cat === "Semua" ? "Semua Kategori" : cat}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E3DED6] flex justify-between text-xs text-[#6B6059]">
            <a href="#informasi" onClick={() => setMobileMenuOpen(false)}>Informasi Produk</a>
            <a href="#tentang" onClick={() => setMobileMenuOpen(false)}>Tentang Toko</a>
          </div>
        </div>
      )}
    </header>
  );
}
