"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { ProductVisual } from "./ProductVisual";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  const getStockIndicator = () => {
    if (!product.inStock || product.stockCount === 0) {
      return (
        <span className="text-xs text-[#998D84] font-normal">
          Stok habis
        </span>
      );
    }
    if (product.stockCount <= 5) {
      return (
        <span className="text-xs text-[#A85842] font-normal">
          Sisa {product.stockCount}
        </span>
      );
    }
    return (
      <span className="text-xs text-[#536859] font-normal">
        Tersedia
      </span>
    );
  };

  return (
    <article
      aria-label={product.name}
      className="group relative flex flex-col justify-between rounded-xl bg-white p-3.5 border border-[#E8E4DC] hover:border-[#D5CEC2] transition-all duration-200"
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#F7F4EE]">
          {!hasImageError && product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-102"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <ProductVisual product={product} />
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5 items-center">
            {product.badge && (
              <span className="px-2.5 py-0.5 text-[10px] font-normal rounded-full bg-white/95 text-[#6B6059] shadow-2xs border border-[#E3DED6]">
                {product.badge}
              </span>
            )}
            {product.discountPercentage && (
              <span className="px-2 py-0.5 text-[10px] font-normal rounded-full bg-[#B86B53]/15 text-[#A85842]">
                -{product.discountPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Content Hierarchy */}
        <div className="mt-3.5 space-y-1">
          {/* Category & Stock */}
          <div className="flex items-center justify-between text-xs text-[#998D84]">
            <span>{product.category}</span>
            {getStockIndicator()}
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base font-normal text-[#2C2523] group-hover:text-[#6E5845] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-[#6B6059] line-clamp-1 font-normal">
            {product.tagline}
          </p>
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-medium text-[#2C2523]">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#998D84] line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          aria-label={
            product.inStock
              ? `Tambah ${product.name} ke keranjang seharga $${product.price}`
              : `${product.name} stok habis`
          }
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
            !product.inStock
              ? "bg-[#EFECE6] text-[#998D84] cursor-not-allowed"
              : justAdded
              ? "bg-[#536859] text-[#FAF6F0]"
              : "bg-[#4B5842] text-[#FAF6F0] hover:bg-[#3D4836] active:scale-98 shadow-2xs"
          }`}
        >
          {justAdded ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Ditambahkan</span>
            </>
          ) : product.inStock ? (
            <span>Tambah</span>
          ) : (
            <span>Habis</span>
          )}
        </button>
      </div>
    </article>
  );
}
