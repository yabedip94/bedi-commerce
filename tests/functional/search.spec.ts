import { test, expect } from "@playwright/test";

test.describe("Storefront Search Functional Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("pencarian dengan nama produk lengkap menampilkan tepat 1 produk", async ({
    page,
  }) => {
    const catalogSearchInput = page.getByRole("searchbox", { name: "Cari produk" });
    await catalogSearchInput.fill("Studio-01 Wireless Headphones");

    // Ringkasan produk dan jumlah kartu terfilter
    await expect(
      page.getByText("Menampilkan 1 dari 12 produk pilihan")
    ).toBeVisible();

    const productCards = page.getByRole("article");
    await expect(productCards).toHaveCount(1);
    await expect(
      page.getByRole("article", { name: "Studio-01 Wireless Headphones" })
    ).toBeVisible();
  });

  test("pencarian dengan kata kunci parsial menampilkan seluruh produk yang relevan", async ({
    page,
  }) => {
    const catalogSearchInput = page.getByRole("searchbox", { name: "Cari produk" });
    await catalogSearchInput.fill("monitor");

    // Kata kunci 'monitor' cocok dengan 'Portable OLED Monitor 15.6"' dan 'Walnut Monitor Stand'
    await expect(
      page.getByText("Menampilkan 2 dari 12 produk pilihan")
    ).toBeVisible();

    const productCards = page.getByRole("article");
    await expect(productCards).toHaveCount(2);
    await expect(
      page.getByRole("article", { name: 'Portable OLED Monitor 15.6"' })
    ).toBeVisible();
    await expect(
      page.getByRole("article", { name: "Walnut Monitor Stand" })
    ).toBeVisible();
  });

  test("pencarian bersifat case-insensitive (huruf besar/kecil tidak berpengaruh)", async ({
    page,
  }) => {
    const catalogSearchInput = page.getByRole("searchbox", { name: "Cari produk" });
    await catalogSearchInput.fill("kEyBoArD");

    await expect(
      page.getByText("Menampilkan 1 dari 12 produk pilihan")
    ).toBeVisible();

    const productCards = page.getByRole("article");
    await expect(productCards).toHaveCount(1);
    await expect(
      page.getByRole("article", { name: "K-75 Mechanical Keyboard" })
    ).toBeVisible();
  });

  test("pencarian tanpa hasil menampilkan empty state dan dapat direset", async ({
    page,
  }) => {
    const catalogSearchInput = page.getByRole("searchbox", { name: "Cari produk" });
    await catalogSearchInput.fill("xyznonexistent");

    // Tidak ada kartu produk yang tampil
    await expect(page.getByRole("article")).toHaveCount(0);

    // Komponen empty state terlihat
    await expect(
      page.getByRole("heading", { level: 3, name: "Produk tidak ditemukan" })
    ).toBeVisible();

    // Reset filter melalui tombol di empty state
    const resetAllButton = page.getByRole("button", {
      name: "Reset Semua Filter",
    });
    await expect(resetAllButton).toBeVisible();
    await resetAllButton.click();

    // Verifikasi kembali ke kondisi awal (12 produk)
    await expect(catalogSearchInput).toHaveValue("");
    await expect(
      page.getByText("Menampilkan 12 dari 12 produk pilihan")
    ).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(12);
  });

  test("tombol hapus pencarian pada katalog mengembalikan seluruh produk", async ({
    page,
  }) => {
    const catalogSearchInput = page.getByRole("searchbox", { name: "Cari produk" });
    await catalogSearchInput.fill("Mouse");

    await expect(page.getByRole("article")).toHaveCount(1);
    await expect(
      page.getByRole("article", { name: "Precision Wireless Mouse M-03" })
    ).toBeVisible();

    // Klik tombol silang hapus pencarian pada in-page search bar
    const clearButton = page.getByRole("button", {
      name: "Hapus pencarian",
    });
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    await expect(catalogSearchInput).toHaveValue("");
    await expect(page.getByRole("article")).toHaveCount(12);
  });

  test("pencarian pada header tersinkronisasi dua arah dengan input katalog", async ({
    page,
  }) => {
    const headerSearchInput = page
      .locator("header")
      .getByPlaceholder("Cari audio, keyboard, monitor, lampu meja...");
    const catalogSearchInput = page.getByRole("searchbox", { name: "Cari produk" });

    // Ketik di header search
    await headerSearchInput.fill("Tumbler");

    // Input katalog otomatis memiliki nilai yang sama
    await expect(catalogSearchInput).toHaveValue("Tumbler");

    // Katalog langsung terfilter
    await expect(page.getByRole("article")).toHaveCount(1);
    await expect(
      page.getByRole("article", { name: "Ceramic Travel Tumbler 470ml" })
    ).toBeVisible();

    // Hapus melalui tombol clear pada header
    const clearHeaderButton = page.getByRole("button", {
      name: "Hapus kata kunci pencarian",
    });
    await expect(clearHeaderButton).toBeVisible();
    await clearHeaderButton.click();

    // Kedua input bersih dan 12 produk kembali
    await expect(headerSearchInput).toHaveValue("");
    await expect(catalogSearchInput).toHaveValue("");
    await expect(page.getByRole("article")).toHaveCount(12);
  });
});
