"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { ProductVisual } from "./ProductVisual";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  const getStockBadge = () => {
    if (!product.inStock || product.stockCount === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Out of Stock
        </span>
      );
    }
    if (product.stockCount <= 5) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Only {product.stockCount} left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        In Stock ({product.stockCount})
      </span>
    );
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case "Bestseller":
        return "bg-amber-500 text-black";
      case "New":
        return "bg-blue-500 text-white";
      case "Sale":
        return "bg-rose-500 text-white";
      case "Limited":
        return "bg-purple-600 text-white";
      default:
        return "bg-zinc-800 text-white";
    }
  };

  return (
    <article
      aria-label={product.name}
      className="group relative flex flex-col justify-between rounded-3xl bg-zinc-50/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5 dark:bg-zinc-900/60 dark:hover:shadow-white/5 border border-zinc-200/80 dark:border-zinc-800/80"
    >
      <div>
        {/* Visual Box with Badges */}
        <div className="relative">
          <ProductVisual product={product} />

          {product.badge && (
            <span
              className={`absolute top-3 left-3 z-20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm ${getBadgeStyle(
                product.badge
              )}`}
            >
              {product.badge}
            </span>
          )}

          <div className="absolute top-3 right-3 z-20">
            {getStockBadge()}
          </div>
        </div>

        {/* Content Details */}
        <div className="mt-4 px-1">
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center text-amber-500" aria-hidden="true">
              ★
            </div>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {product.rating.toFixed(1)}
            </span>
            <span>({product.reviewsCount} reviews)</span>
          </div>

          {/* Title & Tagline */}
          <h3 className="mt-1.5 text-lg font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-amber-600 dark:text-zinc-100 dark:group-hover:text-amber-400">
            {product.name}
          </h3>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {product.tagline}
          </p>

          <p className="mt-2.5 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Feature Highlights */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {product.features.map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[11px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-200/70 dark:border-zinc-800/80 flex items-center justify-between px-1">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-400">
            Price
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-600 dark:text-zinc-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          aria-label={
            product.inStock
              ? `Add ${product.name} to cart for $${product.price}`
              : `${product.name} is out of stock`
          }
          className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
            !product.inStock
              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
              : justAdded
              ? "bg-emerald-600 text-white scale-95"
              : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          }`}
        >
          {justAdded ? (
            <>
              <svg
                className="w-4 h-4 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Added</span>
            </>
          ) : product.inStock ? (
            <>
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
              <span>Add to Cart</span>
            </>
          ) : (
            <span>Sold Out</span>
          )}
        </button>
      </div>
    </article>
  );
}
