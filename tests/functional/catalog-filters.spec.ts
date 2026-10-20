import { test, expect } from "@playwright/test";
import { SAMPLE_PRODUCTS } from "@/data/products";

test.describe("Storefront Catalog Filter & Sorting Functional Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("pemilihan filter kategori menampilkan hanya produk yang sesuai", async ({
    page,
  }) => {
    const tablist = page.getByRole("tablist", {
      name: "Filter kategori produk",
    });

    // 1. Pilih kategori Audio
    const audioTab = tablist.getByRole("tab", { name: /^Audio/ });
    await audioTab.click();
    await expect(audioTab).toHaveAttribute("aria-selected", "true");

    // Dataset: terdapat tepat 2 produk kategori Audio
    await expect(
      page.getByText("Menampilkan 2 dari 12 produk pilihan")
    ).toBeVisible();

    const productCards = page.getByRole("article");
    await expect(productCards).toHaveCount(2);
    await expect(
      page.getByRole("article", { name: "Studio-01 Wireless Headphones" })
    ).toBeVisible();
    await expect(
      page.getByRole("article", { name: "SoundBlock Portable Speaker" })
    ).toBeVisible();

    // 2. Beralih ke kategori Perlengkapan Meja
    const deskTab = tablist.getByRole("tab", { name: /^Perlengkapan Meja/ });
    await deskTab.click();
    await expect(deskTab).toHaveAttribute("aria-selected", "true");

    // Dataset: terdapat 4 produk Perlengkapan Meja
    await expect(
      page.getByText("Menampilkan 4 dari 12 produk pilihan")
    ).toBeVisible();
    await expect(productCards).toHaveCount(4);
  });

  test("reset kategori mengembalikan seluruh 12 produk katalog", async ({
    page,
  }) => {
    const tablist = page.getByRole("tablist", {
      name: "Filter kategori produk",
    });

    // Pilih kategori Gaya Hidup (2 produk)
    await tablist.getByRole("tab", { name: /^Gaya Hidup/ }).click();
    await expect(page.getByRole("article")).toHaveCount(2);

    // Klik tombol 'Reset Filter' yang muncul
    const resetFilterButton = page.getByRole("button", {
      name: "Reset Filter",
    });
    await expect(resetFilterButton).toBeVisible();
    await resetFilterButton.click();

    // Seluruh 12 produk kembali dan tab 'Semua' aktif
    await expect(page.getByRole("article")).toHaveCount(12);
    const allTab = tablist.getByRole("tab", { name: /^Semua/ });
    await expect(allTab).toHaveAttribute("aria-selected", "true");
  });

  test("filter stok tersedia mengecualikan produk yang habis stok", async ({
    page,
  }) => {
    const inStockCheckbox = page.getByLabel("Hanya stok tersedia");

    // Kondisi awal: 12 produk, termasuk produk habis 'Merino All-Weather Jacket'
    await expect(page.getByRole("article")).toHaveCount(12);
    await expect(
      page.getByRole("article", { name: "Merino All-Weather Jacket" })
    ).toBeVisible();

    // Aktifkan filter stok tersedia
    await inStockCheckbox.check();
    await expect(inStockCheckbox).toBeChecked();

    // Jumlah produk berkurang menjadi 11
    await expect(
      page.getByText("Menampilkan 11 dari 12 produk pilihan")
    ).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(11);

    // Produk habis stok tidak lagi ditampilkan di katalog
    await expect(
      page.getByRole("article", { name: "Merino All-Weather Jacket" })
    ).toHaveCount(0);

    // Nonaktifkan kembali filter stok
    await inStockCheckbox.uncheck();
    await expect(page.getByRole("article")).toHaveCount(12);
    await expect(
      page.getByRole("article", { name: "Merino All-Weather Jacket" })
    ).toBeVisible();
  });

  test("pengurutan harga dari rendah ke tinggi menyusun produk secara monoton naik", async ({
    page,
  }) => {
    const sortDropdown = page.getByLabel("Urutkan produk");
    await sortDropdown.selectOption("price-asc");

    const productCards = page.getByRole("article");
    await expect(productCards).toHaveCount(12);

    // Verifikasi produk termurah ($48) dan termahal ($680) pada kedua batas
    await expect(productCards.first()).toHaveAttribute(
      "aria-label",
      "Ceramic Travel Tumbler 470ml"
    );
    await expect(productCards.last()).toHaveAttribute(
      "aria-label",
      "Rangefinder Camera 35mm"
    );

    // Baca dan parse harga dari seluruh 12 kartu produk menggunakan locator semantik teks harga aktif
    const prices: number[] = [];
    for (const card of await productCards.all()) {
      const priceText = await card.getByText(/^\$\d+/).first().textContent();
      expect(priceText).toBeTruthy();
      const numericPrice = Number(priceText!.replace("$", ""));
      expect(Number.isFinite(numericPrice)).toBe(true);
      prices.push(numericPrice);
    }

    expect(prices).toHaveLength(12);

    // Verifikasi seluruh deret harga bersifat monoton naik (non-decreasing)
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  test("pengurutan harga dari tinggi ke rendah menyusun produk secara monoton turun", async ({
    page,
  }) => {
    const sortDropdown = page.getByLabel("Urutkan produk");
    await sortDropdown.selectOption("price-desc");

    const productCards = page.getByRole("article");
    await expect(productCards).toHaveCount(12);

    // Verifikasi produk termahal ($680) dan termurah ($48) pada kedua batas
    await expect(productCards.first()).toHaveAttribute(
      "aria-label",
      "Rangefinder Camera 35mm"
    );
    await expect(productCards.last()).toHaveAttribute(
      "aria-label",
      "Ceramic Travel Tumbler 470ml"
    );

    // Baca dan parse harga dari seluruh 12 kartu produk
    const prices: number[] = [];
    for (const card of await productCards.all()) {
      const priceText = await card.getByText(/^\$\d+/).first().textContent();
      expect(priceText).toBeTruthy();
      const numericPrice = Number(priceText!.replace("$", ""));
      expect(Number.isFinite(numericPrice)).toBe(true);
      prices.push(numericPrice);
    }

    expect(prices).toHaveLength(12);

    // Verifikasi seluruh deret harga bersifat monoton turun (non-increasing)
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  test("pengurutan rating menempatkan produk dengan kepuasan tertinggi di urutan teratas", async ({
    page,
  }) => {
    const sortDropdown = page.getByLabel("Urutkan produk");
    await sortDropdown.selectOption("rating");

    const productCards = page.getByRole("article");
    await expect(productCards).toHaveCount(12);

    // Buat lookup rating dari dataset resmi SAMPLE_PRODUCTS
    const productRatingMap = new Map(
      SAMPLE_PRODUCTS.map((p) => [p.name, p.rating])
    );

    // Ambil urutan rating untuk seluruh 12 kartu produk yang ditampilkan
    const displayedRatings: number[] = [];
    for (const card of await productCards.all()) {
      const productName = await card.getAttribute("aria-label");
      expect(productName).toBeTruthy();
      const rating = productRatingMap.get(productName!);
      expect(rating).toBeDefined();
      displayedRatings.push(rating!);
    }

    expect(displayedRatings).toHaveLength(12);

    // Verifikasi kedua batas rating (tertinggi 4.9 dan terendah 4.6)
    expect(displayedRatings[0]).toBe(4.9);
    expect(displayedRatings[displayedRatings.length - 1]).toBe(4.6);

    // Verifikasi seluruh deret rating tersusun monoton turun (non-increasing)
    for (let i = 0; i < displayedRatings.length - 1; i++) {
      expect(displayedRatings[i]).toBeGreaterThanOrEqual(displayedRatings[i + 1]);
    }
  });

  test("kombinasi filter kategori dan pencarian menyaring katalog secara presisi", async ({
    page,
  }) => {
    const tablist = page.getByRole("tablist", {
      name: "Filter kategori produk",
    });
    const catalogSearchInput = page.getByRole("searchbox", {
      name: "Cari produk",
    });

    // 1. Pilih kategori 'Perlengkapan Meja' (4 produk)
    await tablist.getByRole("tab", { name: /^Perlengkapan Meja/ }).click();
    await expect(page.getByRole("article")).toHaveCount(4);

    // 2. Masukkan kata kunci 'monitor'
    // Walaupun ada 2 monitor di dataset ('Portable OLED Monitor 15.6"' dan 'Walnut Monitor Stand'),
    // hanya 'Walnut Monitor Stand' yang berkategori 'Perlengkapan Meja'.
    await catalogSearchInput.fill("monitor");

    await expect(page.getByRole("article")).toHaveCount(1);
    await expect(
      page.getByRole("article", { name: "Walnut Monitor Stand" })
    ).toBeVisible();

    // 3. Reset Filter mengembalikan semua kondisi default
    const resetFilterButton = page.getByRole("button", {
      name: "Reset Filter",
    });
    await resetFilterButton.click();

    await expect(catalogSearchInput).toHaveValue("");
    await expect(page.getByRole("article")).toHaveCount(12);
  });
});
