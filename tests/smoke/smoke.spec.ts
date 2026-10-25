import { test, expect } from "@/tests/fixtures/base-fixture";

test.describe("Storefront Smoke Tests", () => {
  test.beforeEach(async ({ storefrontPage }) => {
    // Kunjungi halaman utama sebelum setiap test
    await storefrontPage.goto();
  });

  test("homepage dapat dibuka dengan metadata dan heading utama yang benar", async ({
    page,
    storefrontPage,
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
    await expect(storefrontPage.brandLogo).toBeVisible();

    // 4. Verifikasi tombol keranjang belanja terpasang pada kondisi awal (0 item, $0)
    await expect(storefrontPage.headerCartButton).toBeVisible();
    await expect(storefrontPage.headerCartButton).toHaveAccessibleName(
      /Buka keranjang dengan 0 produk, total \$0/i
    );
  });

  test("katalog produk menampilkan 12 produk dan ringkasan yang sesuai pada kondisi awal", async ({
    storefrontPage,
  }) => {
    // 1. Verifikasi teks penghitung katalog pada kondisi awal
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 12 dari 12 produk pilihan"
    );

    // 2. Verifikasi tepat terdapat 12 kartu artikel produk di katalog
    await expect(storefrontPage.productCards).toHaveCount(12);

    // 3. Verifikasi kartu produk unggulan (Studio-01 Wireless Headphones) di dalam katalog
    const sampleProductCard = storefrontPage.getProductCard(
      "Studio-01 Wireless Headphones"
    );
    await expect(sampleProductCard).toBeVisible();
    await expect(
      sampleProductCard.getByRole("heading", {
        level: 3,
        name: "Studio-01 Wireless Headphones",
      })
    ).toBeVisible();
  });
});
