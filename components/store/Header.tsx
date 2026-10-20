"use client";

import React, { useState } from "react";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollToCatalog: () => void;
}

export function Header({
  cartCount,
  onOpenCart,
  onScrollToCatalog,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-black/80 transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Name & Mark */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={onScrollToCatalog}
            className="group flex items-center gap-3 text-left focus:outline-none"
            aria-label="Bedi Commerce Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-md dark:bg-white dark:text-zinc-950 transition-transform group-hover:scale-105">
              <span className="font-mono text-base font-black tracking-tighter">
                BC
              </span>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-zinc-950 dark:text-white">
                Bedi Commerce
              </span>
              <span className="hidden sm:block text-[10px] font-mono tracking-widest uppercase text-zinc-600 dark:text-zinc-400">
                Design & Hardware
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={onScrollToCatalog}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Categories
            </button>
            <a
              href="#about"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Philosophy
            </a>
            <a
              href="#guarantee"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Warranty
            </a>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Search Jump CTA */}
          <button
            type="button"
            onClick={onScrollToCatalog}
            aria-label="Search products"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-zinc-100 px-3.5 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <svg
              className="w-3.5 h-3.5"
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
            <span>Search products...</span>
            <kbd className="hidden lg:inline-block rounded bg-zinc-200/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              /
            </kbd>
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`View cart containing ${cartCount} items`}
            className="relative flex items-center gap-2.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all active:scale-95"
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Cart</span>
            <span
              className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-black tracking-tight transition-all ${
                cartCount > 0
                  ? "bg-amber-500 text-black scale-110"
                  : "bg-zinc-800 text-zinc-400 dark:bg-zinc-200 dark:text-zinc-600"
              }`}
            >
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 backdrop-blur-md dark:bg-zinc-950/95 px-6 py-4 space-y-3">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollToCatalog();
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Store Catalog
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollToCatalog();
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Categories & Filters
          </button>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Design Philosophy
          </a>
          <a
            href="#guarantee"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200"
          >
            2-Year Guarantee
          </a>
        </div>
      )}
    </header>
  );
}
