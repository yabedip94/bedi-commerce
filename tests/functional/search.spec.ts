import { test, expect } from "@/tests/fixtures/base-fixture";

test.describe("Storefront Search Functional Tests", () => {
  test.beforeEach(async ({ storefrontPage }) => {
    await storefrontPage.goto();
  });

  test("pencarian dengan nama produk lengkap menampilkan tepat 1 produk", async ({
    storefrontPage,
  }) => {
    await storefrontPage.searchInCatalog("Studio-01 Wireless Headphones");

    // Ringkasan produk dan jumlah kartu terfilter
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 1 dari 12 produk pilihan"
    );

    await expect(storefrontPage.productCards).toHaveCount(1);
    await expect(
      storefrontPage.getProductCard("Studio-01 Wireless Headphones")
    ).toBeVisible();
  });

  test("pencarian dengan kata kunci parsial menampilkan seluruh produk yang relevan", async ({
    storefrontPage,
  }) => {
    await storefrontPage.searchInCatalog("monitor");

    // Kata kunci 'monitor' cocok dengan 'Portable OLED Monitor 15.6"' dan 'Walnut Monitor Stand'
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 2 dari 12 produk pilihan"
    );

    await expect(storefrontPage.productCards).toHaveCount(2);
    await expect(
      storefrontPage.getProductCard('Portable OLED Monitor 15.6"')
    ).toBeVisible();
    await expect(
      storefrontPage.getProductCard("Walnut Monitor Stand")
    ).toBeVisible();
  });

  test("pencarian bersifat case-insensitive (huruf besar/kecil tidak berpengaruh)", async ({
    storefrontPage,
  }) => {
    await storefrontPage.searchInCatalog("kEyBoArD");

    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 1 dari 12 produk pilihan"
    );

    await expect(storefrontPage.productCards).toHaveCount(1);
    await expect(
      storefrontPage.getProductCard("K-75 Mechanical Keyboard")
    ).toBeVisible();
  });

  test("pencarian tanpa hasil menampilkan empty state dan dapat direset", async ({
    storefrontPage,
  }) => {
    await storefrontPage.searchInCatalog("xyznonexistent");

    // Tidak ada kartu produk yang tampil
    await expect(storefrontPage.productCards).toHaveCount(0);

    // Komponen empty state terlihat
    await expect(storefrontPage.emptyStateHeading).toBeVisible();

    // Reset filter melalui tombol di empty state
    await expect(storefrontPage.emptyStateResetButton).toBeVisible();
    await storefrontPage.emptyStateResetButton.click();

    // Verifikasi kembali ke kondisi awal (12 produk)
    await expect(storefrontPage.catalogSearchInput).toHaveValue("");
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 12 dari 12 produk pilihan"
    );
    await expect(storefrontPage.productCards).toHaveCount(12);
  });

  test("tombol hapus pencarian pada katalog mengembalikan seluruh produk", async ({
    storefrontPage,
  }) => {
    await storefrontPage.searchInCatalog("Mouse");

    await expect(storefrontPage.productCards).toHaveCount(1);
    await expect(
      storefrontPage.getProductCard("Precision Wireless Mouse M-03")
    ).toBeVisible();

    // Klik tombol silang hapus pencarian pada in-page search bar
    await expect(storefrontPage.catalogClearSearchButton).toBeVisible();
    await storefrontPage.catalogClearSearchButton.click();

    await expect(storefrontPage.catalogSearchInput).toHaveValue("");
    await expect(storefrontPage.productCards).toHaveCount(12);
  });

  test("pencarian pada header tersinkronisasi dua arah dengan input katalog", async ({
    storefrontPage,
  }) => {
    // Ketik di header search
    await storefrontPage.searchInHeader("Tumbler");

    // Input katalog otomatis memiliki nilai yang sama
    await expect(storefrontPage.catalogSearchInput).toHaveValue("Tumbler");

    // Katalog langsung terfilter
    await expect(storefrontPage.productCards).toHaveCount(1);
    await expect(
      storefrontPage.getProductCard("Ceramic Travel Tumbler 470ml")
    ).toBeVisible();

    // Hapus melalui tombol clear pada header
    await expect(storefrontPage.headerClearSearchButton).toBeVisible();
    await storefrontPage.headerClearSearchButton.click();

    // Kedua input bersih dan 12 produk kembali
    await expect(storefrontPage.headerSearchInput).toHaveValue("");
    await expect(storefrontPage.catalogSearchInput).toHaveValue("");
    await expect(storefrontPage.productCards).toHaveCount(12);
  });
});
