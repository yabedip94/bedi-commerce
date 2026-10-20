import { test, expect } from "@playwright/test";

test.describe("Storefront Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Kunjungi halaman utama sebelum setiap test
    await page.goto("/");
  });

  test("homepage dapat dibuka dengan metadata dan heading utama yang benar", async ({
    page,
  }) => {
    // 1. Verifikasi judul dokumen sesuai metadata di app/layout.tsx
    await expect(page).toHaveTitle(
      "Bedi Commerce — Toko Elektronik & Perlengkapan Kerja"
    );

    // 2. Verifikasi heading level 1 utama terlihat dan sesuai copywriting Indonesia
    const mainHeading = page.getByRole("heading", {
      level: 1,
      name: "Perangkat kerja yang dibuat untuk dipakai setiap hari.",
    });
    await expect(mainHeading).toBeVisible();

    // 3. Verifikasi identitas brand terlihat pada header
    const brandButton = page.getByRole("button", {
      name: "Beranda Bedi Commerce",
    });
    await expect(brandButton).toBeVisible();

    // 4. Verifikasi tombol keranjang belanja terpasang pada kondisi awal (0 item, $0)
    const cartButton = page.getByRole("button", {
      name: /Buka keranjang dengan 0 produk, total \$0/i,
    });
    await expect(cartButton).toBeVisible();
  });

  test("katalog produk menampilkan 12 produk dan ringkasan yang sesuai pada kondisi awal", async ({
    page,
  }) => {
    // 1. Verifikasi teks penghitung katalog pada kondisi awal
    const catalogSummary = page.getByText(
      "Menampilkan 12 dari 12 produk pilihan"
    );
    await expect(catalogSummary).toBeVisible();

    // 2. Verifikasi tepat terdapat 12 kartu artikel produk di katalog
    const productCards = page.getByRole("article");
    await expect(productCards).toHaveCount(12);

    // 3. Verifikasi kartu produk unggulan (Studio-01 Wireless Headphones) di dalam katalog
    const sampleProductCard = page.getByRole("article", {
      name: "Studio-01 Wireless Headphones",
    });
    await expect(sampleProductCard).toBeVisible();
    await expect(
      sampleProductCard.getByRole("heading", {
        level: 3,
        name: "Studio-01 Wireless Headphones",
      })
    ).toBeVisible();
  });
});
