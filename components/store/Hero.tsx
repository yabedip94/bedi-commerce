"use client";

import React from "react";
import Image from "next/image";
import { ProductCategory } from "@/types/product";

interface HeroProps {
  onShopClick: () => void;
  onSelectCategory: (category: ProductCategory) => void;
}

export function Hero({ onShopClick, onSelectCategory }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#EFECE6] text-[#2C2523] py-16 lg:py-24 border-b border-[#E3DED6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Headline & Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#536859] bg-white/80 px-3.5 py-1 rounded-full border border-[#DED8CE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#536859]" />
              Koleksi Pilihan
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#2C2523] leading-[1.14]">
              Perangkat kerja yang dibuat untuk dipakai setiap hari.
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-[#6B6059] leading-relaxed font-normal">
              Pilihan audio, keyboard mekanis, dan perlengkapan meja kerja dengan spesifikasi yang jelas dan desain yang fungsional.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onShopClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#4B5842] text-[#FAF6F0] text-xs font-medium shadow-xs hover:bg-[#3D4836] active:scale-98 transition-all text-center"
              >
                Lihat Katalog
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory("Audio");
                  onShopClick();
                }}
                className="w-full sm:w-auto px-5 py-3.5 text-xs text-[#4B5842] hover:text-[#3D4836] font-medium transition-colors underline underline-offset-4"
              >
                Kategori Audio &rarr;
              </button>
            </div>

            {/* Practical Notes */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#DED8CE] text-left">
              <div>
                <div className="text-xs font-medium text-[#2C2523]">Katalog Demonstrasi</div>
                <div className="text-[11px] text-[#6B6059] mt-0.5">Purwarupa toko antarmuka independen</div>
              </div>
              <div>
                <div className="text-xs font-medium text-[#2C2523]">Spesifikasi Model</div>
                <div className="text-[11px] text-[#6B6059] mt-0.5">Rincian teknis untuk simulasi produk</div>
              </div>
              <div>
                <div className="text-xs font-medium text-[#2C2523]">Desain Fungsional</div>
                <div className="text-[11px] text-[#6B6059] mt-0.5">Tata letak terarah dan responsif</div>
              </div>
            </div>
          </div>

          {/* Visual Showcase (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-2xl bg-white p-4 border border-[#E3DED6] shadow-xs">
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F7F4EE]">
                <Image
                  src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
                  alt="Studio-01 Wireless Headphones"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              <div className="mt-4 px-1 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] text-[#998D84] block font-normal">
                    Produk Unggulan
                  </span>
                  <h3 className="font-serif text-sm font-normal text-[#2C2523] mt-0.5">
                    Studio-01 Wireless Headphones
                  </h3>
                  <p className="text-xs text-[#6B6059] mt-0.5">
                    Driver bio-selulosa 40mm dengan koneksi Bluetooth 5.4
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-semibold text-[#2C2523] block">
                    $349
                  </span>
                  <span className="text-xs text-[#998D84] line-through">
                    $399
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
