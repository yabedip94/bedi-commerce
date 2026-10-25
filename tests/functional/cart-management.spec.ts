import { test, expect } from "@playwright/test";

test.describe("Storefront Cart Management & Shipping Functional Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC-CART-01: menaikkan kuantitas item melalui stepper drawer memperbarui subtotal dan header", async ({
    page,
  }) => {
    // Tambah Precision Wireless Mouse M-03 ($119) ke keranjang
    const addMouseBtn = page.getByRole("button", {
      name: "Tambah Precision Wireless Mouse M-03 ke keranjang seharga $119",
    });
    await expect(addMouseBtn).toBeVisible();
    await addMouseBtn.click();

    // Buka drawer keranjang
    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });
    await expect(drawer).toBeVisible();

    // Verifikasi kondisi awal di dalam drawer (qty: 1, $119)
    const itemCard = drawer.locator("div.rounded-xl", {
      hasText: "Precision Wireless Mouse M-03",
    });
    await expect(itemCard).toBeVisible();
    await expect(itemCard.getByText("$119 per unit")).toBeVisible();
    await expect(itemCard.locator("span", { hasText: "1" })).toBeVisible();

    // Klik tombol '+' untuk menaikkan kuantitas
    const plusBtn = itemCard.getByRole("button", { name: "Tambah kuantitas" });
    await plusBtn.click();

    // Verifikasi kuantitas berubah menjadi 2
    await expect(itemCard.locator("span", { hasText: "2" })).toBeVisible();

    // Verifikasi total harga baris produk menjadi $238 ($119 x 2)
    await expect(itemCard.getByText("$238")).toBeVisible();

    // Verifikasi subtotal di footer drawer menjadi $238
    await expect(drawer.getByText("$238").last()).toBeVisible();

    // Verifikasi counter dan subtotal pada header cart button terbarui menjadi (2) dan $238
    await expect(cartButton).toContainText("(2)");
    await expect(cartButton).toContainText("$238");
  });

  test("TC-CART-02: menurunkan kuantitas item melalui stepper memperbarui kalkulasi total", async ({
    page,
  }) => {
    // Tambah Precision Wireless Mouse M-03 ($119)
    const addMouseBtn = page.getByRole("button", {
      name: "Tambah Precision Wireless Mouse M-03 ke keranjang seharga $119",
    });
    await addMouseBtn.click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });
    const itemCard = drawer.locator("div.rounded-xl", {
      hasText: "Precision Wireless Mouse M-03",
    });

    // Naikkan kuantitas ke 2 terlebih dahulu
    const plusBtn = itemCard.getByRole("button", { name: "Tambah kuantitas" });
    await plusBtn.click();
    await expect(itemCard.locator("span", { hasText: "2" })).toBeVisible();
    await expect(itemCard.getByText("$238")).toBeVisible();

    // Klik tombol '-' untuk menurunkan kuantitas kembali ke 1
    const minusBtn = itemCard.getByRole("button", { name: "Kurangi kuantitas" });
    await minusBtn.click();

    // Verifikasi kuantitas kembali menjadi 1
    await expect(itemCard.locator("span", { hasText: "1" })).toBeVisible();

    // Verifikasi total baris produk kembali menjadi $119
    await expect(itemCard.getByText("$119").last()).toBeVisible();

    // Verifikasi header cart button tersinkronisasi kembali ke (1) dan $119
    await expect(cartButton).toContainText("(1)");
    await expect(cartButton).toContainText("$119");
  });

  test("TC-CART-03: kuantitas dibatasi oleh jumlah stok produk (tombol tambah disabled saat mencapai batas stok)", async ({
    page,
  }) => {
    // Rangefinder Camera 35mm memiliki stok terbatas tepat 2 unit (stockCount: 2)
    const addCameraBtn = page.getByRole("button", {
      name: "Tambah Rangefinder Camera 35mm ke keranjang seharga $680",
    });
    await addCameraBtn.click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });
    const itemCard = drawer.locator("div.rounded-xl", {
      hasText: "Rangefinder Camera 35mm",
    });

    // Kuantitas awal 1
    await expect(itemCard.locator("span", { hasText: "1" })).toBeVisible();

    const plusBtn = itemCard.getByRole("button", { name: "Tambah kuantitas" });
    await expect(plusBtn).toBeEnabled();

    // Naikkan kuantitas ke 2 (batas maksimal stok)
    await plusBtn.click();
    await expect(itemCard.locator("span", { hasText: "2" })).toBeVisible();

    // Tombol '+' harus berada dalam kondisi disabled
    await expect(plusBtn).toBeDisabled();
    await expect(plusBtn).toHaveClass(/disabled:cursor-not-allowed/);
  });

  test("TC-CART-04: menurunkan kuantitas dari satu ke nol otomatis menghapus item dari keranjang", async ({
    page,
  }) => {
    // Tambah Ceramic Travel Tumbler 470ml ($48)
    const addTumblerBtn = page.getByRole("button", {
      name: "Tambah Ceramic Travel Tumbler 470ml ke keranjang seharga $48",
    });
    await addTumblerBtn.click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });
    const itemCard = drawer.locator("div.rounded-xl", {
      hasText: "Ceramic Travel Tumbler 470ml",
    });
    await expect(itemCard).toBeVisible();

    // Klik tombol '-' saat kuantitas 1
    const minusBtn = itemCard.getByRole("button", { name: "Kurangi kuantitas" });
    await minusBtn.click();

    // Item terhapus dari daftar kartu di drawer
    await expect(
      drawer.getByRole("heading", {
        level: 4,
        name: "Ceramic Travel Tumbler 470ml",
      })
    ).toHaveCount(0);

    // Drawer beralih ke empty state
    await expect(
      drawer.getByRole("heading", {
        level: 3,
        name: "Keranjang belanja kosong",
      })
    ).toBeVisible();
    await expect(
      drawer.getByRole("button", { name: "Mulai Belanja" })
    ).toBeVisible();

    // Header counter kembali ke kondisi awal (0) $0
    await expect(cartButton).toContainText("(0)");
    await expect(cartButton).toContainText("$0");
  });

  test("TC-CART-05: menghapus salah satu item secara spesifik tetap mempertahankan item lainnya", async ({
    page,
  }) => {
    // Tambah Produk A: Studio-01 Wireless Headphones ($349)
    await page
      .getByRole("button", {
        name: "Tambah Studio-01 Wireless Headphones ke keranjang seharga $349",
      })
      .click();

    // Tambah Produk B: Ceramic Travel Tumbler 470ml ($48)
    await page
      .getByRole("button", {
        name: "Tambah Ceramic Travel Tumbler 470ml ke keranjang seharga $48",
      })
      .click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });

    // Verifikasi kedua produk berada di dalam drawer
    await expect(
      drawer.getByRole("heading", {
        level: 4,
        name: "Studio-01 Wireless Headphones",
      })
    ).toBeVisible();
    await expect(
      drawer.getByRole("heading", {
        level: 4,
        name: "Ceramic Travel Tumbler 470ml",
      })
    ).toBeVisible();

    // Subtotal awal adalah $397 ($349 + $48) (muncul pada baris Subtotal dan Total karena gratis ongkir)
    await expect(drawer.getByText("$397").first()).toBeVisible();

    // Klik tombol hapus khusus Ceramic Travel Tumbler
    const removeTumblerBtn = drawer.getByRole("button", {
      name: "Hapus Ceramic Travel Tumbler 470ml dari keranjang",
    });
    await expect(removeTumblerBtn).toBeVisible();
    await removeTumblerBtn.click();

    // Verifikasi Ceramic Travel Tumbler sudah tidak ada
    await expect(
      drawer.getByRole("heading", {
        level: 4,
        name: "Ceramic Travel Tumbler 470ml",
      })
    ).toHaveCount(0);

    // Verifikasi Studio-01 Wireless Headphones tetap ada di keranjang
    await expect(
      drawer.getByRole("heading", {
        level: 4,
        name: "Studio-01 Wireless Headphones",
      })
    ).toBeVisible();

    // Verifikasi subtotal berkurang menjadi $349
    await expect(drawer.getByText("$349").last()).toBeVisible();
    await expect(cartButton).toContainText("(1)");
    await expect(cartButton).toContainText("$349");
  });

  test("TC-CART-06: mengosongkan seluruh keranjang melalui tombol 'Kosongkan' mengembalikan empty state", async ({
    page,
  }) => {
    // Tambah dua produk ke keranjang
    await page
      .getByRole("button", {
        name: "Tambah K-75 Mechanical Keyboard ke keranjang seharga $189",
      })
      .click();
    await page
      .getByRole("button", {
        name: "Tambah Precision Wireless Mouse M-03 ke keranjang seharga $119",
      })
      .click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });

    // Verifikasi tombol 'Kosongkan' terlihat pada footer drawer
    const clearButton = drawer.getByRole("button", { name: "Kosongkan" });
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Drawer beralih ke empty state
    await expect(
      drawer.getByRole("heading", {
        level: 3,
        name: "Keranjang belanja kosong",
      })
    ).toBeVisible();
    await expect(
      drawer.getByRole("button", { name: "Mulai Belanja" })
    ).toBeVisible();

    // Footer ringkasan belanja disembunyikan
    await expect(clearButton).toHaveCount(0);
    await expect(
      drawer.getByRole("button", { name: "Lanjut ke Pembayaran" })
    ).toHaveCount(0);

    // Header counter kembali ke (0) $0
    await expect(cartButton).toContainText("(0)");
    await expect(cartButton).toContainText("$0");
  });

  test("TC-CART-07: verifikasi biaya pengiriman $15 di bawah ambang batas gratis ongkir $150", async ({
    page,
  }) => {
    // Tambah Ceramic Travel Tumbler 470ml ($48, subtotal < $150)
    await page
      .getByRole("button", {
        name: "Tambah Ceramic Travel Tumbler 470ml ke keranjang seharga $48",
      })
      .click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });

    // Subtotal = $48
    await expect(drawer.getByText("$48").last()).toBeVisible();

    // Estimasi Pengiriman menampilkan $15
    await expect(drawer.getByText("$15")).toBeVisible();

    // Teks pengingat gratis ongkir: 150 - 48 = $102
    await expect(
      drawer.getByText("Tambah $102 lagi untuk gratis ongkir")
    ).toBeVisible();

    // Total = $63 ($48 subtotal + $15 ongkir)
    await expect(drawer.getByText("$63")).toBeVisible();
  });

  test("TC-CART-08: verifikasi transisi biaya pengiriman dari $15 menjadi Gratis saat mencapai ambang $150", async ({
    page,
  }) => {
    // Tambah 1 unit Precision Wireless Mouse M-03 ($119, subtotal < $150)
    await page
      .getByRole("button", {
        name: "Tambah Precision Wireless Mouse M-03 ke keranjang seharga $119",
      })
      .click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });

    // Kondisi awal: Subtotal $119, Ongkir $15, Total $134 ($119 + $15), sisa $31 untuk gratis ongkir
    await expect(drawer.getByText("$15")).toBeVisible();
    await expect(drawer.getByText("$134")).toBeVisible();
    await expect(
      drawer.getByText("Tambah $31 lagi untuk gratis ongkir")
    ).toBeVisible();

    // Naikkan kuantitas mouse menjadi 2 unit ($119 x 2 = $238 >= $150)
    const itemCard = drawer.locator("div.rounded-xl", {
      hasText: "Precision Wireless Mouse M-03",
    });
    const plusBtn = itemCard.getByRole("button", { name: "Tambah kuantitas" });
    await plusBtn.click();

    // Verifikasi subtotal berubah menjadi $238
    await expect(drawer.getByText("$238").first()).toBeVisible();

    // Verifikasi banner gratis ongkir aktif muncul dan progress 100%
    await expect(
      drawer.getByText("Gratis ongkos kirim aktif (pesanan di atas $150)")
    ).toBeVisible();
    await expect(drawer.getByText("100%")).toBeVisible();

    // Verifikasi Estimasi Pengiriman berubah menjadi 'Gratis'
    await expect(drawer.getByText("Gratis", { exact: true })).toBeVisible();

    // Verifikasi Total menjadi $238 (tanpa tambahan biaya $15)
    await expect(drawer.getByText("$238").last()).toBeVisible();
  });

  test("TC-CART-09: penutupan drawer keranjang menggunakan tombol Escape dan klik backdrop", async ({
    page,
  }) => {
    // Tambah produk dan buka drawer
    await page
      .getByRole("button", {
        name: "Tambah Studio-01 Wireless Headphones ke keranjang seharga $349",
      })
      .click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });
    await expect(drawer).toBeVisible();

    // 1. Uji penutupan drawer dengan tombol Escape
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();

    // 2. Buka kembali drawer
    await cartButton.click();
    await expect(drawer).toBeVisible();

    // 3. Uji penutupan drawer dengan klik area backdrop gelap (di sisi kiri panel)
    // Di desktop, area kiri (x=50, y=50) merupakan overlay backdrop dengan onClick={onClose}
    await page.mouse.click(50, 50);
    await expect(drawer).toBeHidden();
  });

  test("TC-CART-10: verifikasi tombol checkout aktif dan membuka modal checkout pesanan", async ({
    page,
  }) => {
    // Tambah produk dan buka drawer
    await page
      .getByRole("button", {
        name: "Tambah Studio-01 Wireless Headphones ke keranjang seharga $349",
      })
      .click();

    const cartButton = page.getByRole("button", { name: /Buka keranjang/i });
    await cartButton.click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });

    const checkoutButton = drawer.getByRole("button", {
      name: "Lanjut ke Pembayaran",
    });
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();

    // Klik tombol checkout untuk membuka modal checkout
    await checkoutButton.click();

    // Verifikasi modal checkout terbuka
    const checkoutModal = page.getByRole("dialog", {
      name: "Modal Checkout Pesanan",
    });
    await expect(checkoutModal).toBeVisible();
    await expect(
      checkoutModal.getByRole("heading", { name: "Checkout Pesanan" })
    ).toBeVisible();
    await expect(
      checkoutModal.getByRole("button", { name: "Konfirmasi & Buat Pesanan" })
    ).toBeVisible();
  });
});
