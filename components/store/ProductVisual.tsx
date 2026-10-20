"use client";

import React from "react";
import { Product } from "@/types/product";

interface ProductVisualProps {
  product: Product;
}

export function ProductVisual({ product }: ProductVisualProps) {
  const { icon } = product.visualTheme;

  const renderIcon = () => {
    switch (icon) {
      case "headphones":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 003 3h1a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1zm18 0a3 3 0 01-3 3h-1a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1z"
            />
          </svg>
        );
      case "keyboard":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm4 3h.01M10 10h.01M13 10h.01M16 10h.01M7 13h.01M10 13h.01M13 13h.01M16 13h.01M8 16h8"
            />
          </svg>
        );
      case "watch":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 3h6m-6 18h6"
            />
          </svg>
        );
      case "bag":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        );
      case "lamp":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case "mouse":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2C8.686 2 6 4.686 6 8v8c0 3.314 2.686 6 6 6s6-2.686 6-6V8c0-3.314-2.686-6-6-6zm0 4v4"
            />
          </svg>
        );
      case "speaker":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        );
      case "cup":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"
            />
          </svg>
        );
      case "jacket":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 4l4 4-2 12H6L4 8l4-4 4 3 4-3zM12 7v13"
            />
          </svg>
        );
      case "laptop":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "desk":
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 10h16M4 6v12M20 6v12M9 10v8M15 10v8"
            />
          </svg>
        );
      case "camera":
      default:
        return (
          <svg
            className="w-16 h-16 text-[#6E5845] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-[#EFECE6] text-[#7D6652]">
      <div className="text-[#7D6652]">
        {renderIcon()}
      </div>
      <span className="mt-2 text-[10px] text-[#998D84] font-normal">
        {product.category}
      </span>
    </div>
  );
}
