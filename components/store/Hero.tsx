"use client";

import React from "react";

interface HeroProps {
  onShopClick: () => void;
}

export function Hero({ onShopClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white py-20 lg:py-28 border-b border-zinc-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-medium text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              SPRING 2026 CATALOG LIVE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Engineered for Focus. <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                Curated for Living.
              </span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Bedi Commerce curates high-fidelity audio, mechanical desk instruments, and minimalist daily essentials. Designed with meticulous craftsmanship and built to endure.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                onClick={onShopClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-zinc-950 font-bold text-sm shadow-xl shadow-white/10 hover:bg-zinc-100 active:scale-95 transition-all"
              >
                <span>Shop the Collection</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <a
                href="#guarantee"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 text-white font-medium text-sm hover:bg-white/15 border border-white/10 transition-all"
              >
                Our 2-Year Guarantee
              </a>
            </div>

            {/* Key Proof Points */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">4.9/5</div>
                <div className="text-xs text-zinc-400">Average Customer Rating</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-xs text-zinc-400">Carbon-Neutral Delivery</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">30 Days</div>
                <div className="text-xs text-zinc-400">Risk-Free Trials</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl bg-zinc-900/80 p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">
                    Featured Instrument
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Staff Pick
                </span>
              </div>

              {/* Showcase Visual Graphic */}
              <div className="my-6 relative h-52 rounded-2xl bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-zinc-800 flex items-center justify-center border border-white/10 overflow-hidden">
                <svg
                  className="w-24 h-24 text-amber-300 drop-shadow-xl"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 003 3h1a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1zm18 0a3 3 0 01-3 3h-1a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1z"
                  />
                </svg>
                <div className="absolute bottom-3 left-3 text-[11px] font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  Model: AP-900 Spatial Studio
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white">
                  AeroPulse Wireless Studio Headphones
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Engineered with 40mm bio-cellulose drivers, memory foam isolation, and titanium alloy headband.
                </p>
                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block">Launch Special</span>
                    <span className="text-2xl font-black text-amber-400">$349</span>
                  </div>
                  <button
                    type="button"
                    onClick={onShopClick}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    View in Catalog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
