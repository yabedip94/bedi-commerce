import { test, expect } from "@/tests/fixtures/base-fixture";
import { SAMPLE_PRODUCTS } from "@/data/products";

test.describe("Storefront Catalog Filter & Sorting Functional Tests", () => {
  test.beforeEach(async ({ storefrontPage }) => {
    await storefrontPage.goto();
  });

  test("pemilihan filter kategori menampilkan hanya produk yang sesuai", async ({
    storefrontPage,
  }) => {
    // 1. Pilih kategori Audio
    const audioTab = storefrontPage.getCategoryTab("Audio");
    await audioTab.click();
    await expect(audioTab).toHaveAttribute("aria-selected", "true");

    // Dataset: terdapat tepat 2 produk kategori Audio
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 2 dari 12 produk pilihan"
    );

    await expect(storefrontPage.productCards).toHaveCount(2);
    await expect(
      storefrontPage.getProductCard("Studio-01 Wireless Headphones")
    ).toBeVisible();
    await expect(
      storefrontPage.getProductCard("SoundBlock Portable Speaker")
    ).toBeVisible();

    // 2. Beralih ke kategori Perlengkapan Meja
    const deskTab = storefrontPage.getCategoryTab("Perlengkapan Meja");
    await deskTab.click();
    await expect(deskTab).toHaveAttribute("aria-selected", "true");

    // Dataset: terdapat 4 produk Perlengkapan Meja
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 4 dari 12 produk pilihan"
    );
    await expect(storefrontPage.productCards).toHaveCount(4);
  });

  test("reset kategori mengembalikan seluruh 12 produk katalog", async ({
    storefrontPage,
  }) => {
    // Pilih kategori Gaya Hidup (2 produk)
    const lifestyleTab = storefrontPage.getCategoryTab("Gaya Hidup");
    await lifestyleTab.click();
    await expect(storefrontPage.productCards).toHaveCount(2);

    // Klik tombol 'Reset Filter' yang muncul
    await expect(storefrontPage.resetFilterButton).toBeVisible();
    await storefrontPage.resetFilterButton.click();

    // Seluruh 12 produk kembali dan tab 'Semua' aktif
    await expect(storefrontPage.productCards).toHaveCount(12);
    const allTab = storefrontPage.getCategoryTab("Semua");
    await expect(allTab).toHaveAttribute("aria-selected", "true");
  });

  test("filter stok tersedia mengecualikan produk yang habis stok", async ({
    storefrontPage,
  }) => {
    // Kondisi awal: 12 produk, termasuk produk habis 'Merino All-Weather Jacket'
    await expect(storefrontPage.productCards).toHaveCount(12);
    await expect(
      storefrontPage.getProductCard("Merino All-Weather Jacket")
    ).toBeVisible();

    // Aktifkan filter stok tersedia
    await storefrontPage.inStockOnlyCheckbox.check();
    await expect(storefrontPage.inStockOnlyCheckbox).toBeChecked();

    // Jumlah produk berkurang menjadi 11
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 11 dari 12 produk pilihan"
    );
    await expect(storefrontPage.productCards).toHaveCount(11);

    // Produk habis stok tidak lagi ditampilkan di katalog
    await expect(
      storefrontPage.getProductCard("Merino All-Weather Jacket")
    ).toHaveCount(0);

    // Nonaktifkan kembali filter stok
    await storefrontPage.inStockOnlyCheckbox.uncheck();
    await expect(storefrontPage.productCards).toHaveCount(12);
    await expect(
      storefrontPage.getProductCard("Merino All-Weather Jacket")
    ).toBeVisible();
  });

  test("pengurutan harga dari rendah ke tinggi menyusun produk secara monoton naik", async ({
    storefrontPage,
  }) => {
    await storefrontPage.sortSelect.selectOption("price-asc");

    await expect(storefrontPage.productCards).toHaveCount(12);

    // Verifikasi produk termurah ($48) dan termahal ($680) pada kedua batas
    await expect(storefrontPage.productCards.first()).toHaveAttribute(
      "aria-label",
      "Ceramic Travel Tumbler 470ml"
    );
    await expect(storefrontPage.productCards.last()).toHaveAttribute(
      "aria-label",
      "Rangefinder Camera 35mm"
    );

    // Baca dan parse harga dari seluruh 12 kartu produk menggunakan locator semantik teks harga aktif
    const prices: number[] = [];
    for (const card of await storefrontPage.productCards.all()) {
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
    storefrontPage,
  }) => {
    await storefrontPage.sortSelect.selectOption("price-desc");

    await expect(storefrontPage.productCards).toHaveCount(12);

    // Verifikasi produk termahal ($680) dan termurah ($48) pada kedua batas
    await expect(storefrontPage.productCards.first()).toHaveAttribute(
      "aria-label",
      "Rangefinder Camera 35mm"
    );
    await expect(storefrontPage.productCards.last()).toHaveAttribute(
      "aria-label",
      "Ceramic Travel Tumbler 470ml"
    );

    // Baca dan parse harga dari seluruh 12 kartu produk
    const prices: number[] = [];
    for (const card of await storefrontPage.productCards.all()) {
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
    storefrontPage,
  }) => {
    await storefrontPage.sortSelect.selectOption("rating");

    await expect(storefrontPage.productCards).toHaveCount(12);

    // Buat lookup rating dari dataset resmi SAMPLE_PRODUCTS
    const productRatingMap = new Map(
      SAMPLE_PRODUCTS.map((p) => [p.name, p.rating])
    );

    // Ambil urutan rating untuk seluruh 12 kartu produk yang ditampilkan
    const displayedRatings: number[] = [];
    for (const card of await storefrontPage.productCards.all()) {
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
    storefrontPage,
  }) => {
    // 1. Pilih kategori 'Perlengkapan Meja' (4 produk)
    const deskTab = storefrontPage.getCategoryTab("Perlengkapan Meja");
    await deskTab.click();
    await expect(storefrontPage.productCards).toHaveCount(4);

    // 2. Masukkan kata kunci 'monitor'
    // Walaupun ada 2 monitor di dataset ('Portable OLED Monitor 15.6"' dan 'Walnut Monitor Stand'),
    // hanya 'Walnut Monitor Stand' yang berkategori 'Perlengkapan Meja'.
    await storefrontPage.searchInCatalog("monitor");

    await expect(storefrontPage.productCards).toHaveCount(1);
    await expect(
      storefrontPage.getProductCard("Walnut Monitor Stand")
    ).toBeVisible();

    // 3. Reset Filter mengembalikan semua kondisi default
    await storefrontPage.resetFilterButton.click();

    await expect(storefrontPage.catalogSearchInput).toHaveValue("");
    await expect(storefrontPage.productCards).toHaveCount(12);
  });

  test("pilihan kategori pada header dropdown tersinkronisasi dua arah dengan tab katalog", async ({
    page,
    storefrontPage,
  }) => {
    // Pastikan ukuran layar desktop agar header category dropdown terlihat
    await page.setViewportSize({ width: 1280, height: 800 });

    const audioTab = storefrontPage.getCategoryTab("Audio");
    const deskTab = storefrontPage.getCategoryTab("Perlengkapan Meja");
    const allTab = storefrontPage.getCategoryTab("Semua");

    // 1. Pilih kategori 'Audio' melalui header dropdown
    await expect(storefrontPage.headerCategorySelect).toBeVisible();
    await storefrontPage.headerCategorySelect.selectOption("Audio");

    // Verifikasi tab Audio pada katalog otomatis aktif dan produk terfilter
    await expect(audioTab).toHaveAttribute("aria-selected", "true");
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 2 dari 12 produk pilihan"
    );
    await expect(storefrontPage.productCards).toHaveCount(2);

    // 2. Beralih ke kategori 'Perlengkapan Meja' melalui tab katalog
    await deskTab.click();
    await expect(deskTab).toHaveAttribute("aria-selected", "true");

    // Verifikasi header dropdown otomatis tersinkronisasi ke 'Perlengkapan Meja'
    await expect(storefrontPage.headerCategorySelect).toHaveValue("Perlengkapan Meja");
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 4 dari 12 produk pilihan"
    );
    await expect(storefrontPage.productCards).toHaveCount(4);

    // 3. Reset filter melalui tombol 'Reset Filter'
    await expect(storefrontPage.resetFilterButton).toBeVisible();
    await storefrontPage.resetFilterButton.click();

    // Verifikasi kedua kontrol kembali ke kondisi default 'Semua' dan seluruh 12 produk tampil
    await expect(storefrontPage.headerCategorySelect).toHaveValue("Semua");
    await expect(allTab).toHaveAttribute("aria-selected", "true");
    await expect(storefrontPage.productSummaryText).toBeVisible();
    await expect(storefrontPage.productSummaryText).toHaveText(
      "Menampilkan 12 dari 12 produk pilihan"
    );
    await expect(storefrontPage.productCards).toHaveCount(12);
  });
});
