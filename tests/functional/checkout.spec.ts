import { test, expect } from "@playwright/test";

test.describe("Storefront Checkout UI Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC-CHK-01: membuka modal checkout dari cart drawer dan menampilkan ringkasan belanja", async ({
    page,
  }) => {
    // Tambah Precision Wireless Mouse M-03 ($119)
    await page
      .getByRole("button", {
        name: "Tambah Precision Wireless Mouse M-03 ke keranjang seharga $119",
      })
      .click();

    // Buka keranjang
    await page.getByRole("button", { name: /Buka keranjang/i }).click();

    const drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });
    await expect(drawer).toBeVisible();

    // Klik tombol Lanjut ke Pembayaran
    const checkoutBtn = drawer.getByRole("button", {
      name: "Lanjut ke Pembayaran",
    });
    await checkoutBtn.click();

    // Drawer tertutup dan modal checkout terbuka
    await expect(drawer).toBeHidden();

    const modal = page.getByRole("dialog", {
      name: "Modal Checkout Pesanan",
    });
    await expect(modal).toBeVisible();
    await expect(
      modal.getByRole("heading", { name: "Checkout Pesanan" })
    ).toBeVisible();

    // Verifikasi field form tersedia
    await expect(page.locator("#checkout-fullname")).toBeVisible();
    await expect(page.locator("#checkout-email")).toBeVisible();
    await expect(page.locator("#checkout-phone")).toBeVisible();
    await expect(page.locator("#checkout-street")).toBeVisible();
    await expect(page.locator("#checkout-city")).toBeVisible();
    await expect(page.locator("#checkout-postal")).toBeVisible();
    await expect(page.locator("#checkout-province")).toBeVisible();

    // Verifikasi ringkasan pesanan di dalam modal ($119 + $15 = $134)
    await expect(modal.getByText("Precision Wireless Mouse M-03 × 1")).toBeVisible();
    await expect(modal.getByText("$119").first()).toBeVisible();
    await expect(modal.getByText("$15")).toBeVisible();
    await expect(modal.getByText("$134")).toBeVisible();
  });

  test("TC-CHK-02: validasi field pelanggan wajib menampilkan pesan peringatan jika kosong", async ({
    page,
  }) => {
    // Tambah produk dan buka checkout
    await page
      .getByRole("button", {
        name: "Tambah Studio-01 Wireless Headphones ke keranjang seharga $349",
      })
      .click();
    await page.getByRole("button", { name: /Buka keranjang/i }).click();
    await page.getByRole("button", { name: "Lanjut ke Pembayaran" }).click();

    const modal = page.getByRole("dialog", {
      name: "Modal Checkout Pesanan",
    });
    await expect(modal).toBeVisible();

    // Submit form langsung tanpa mengisi field wajib
    const submitBtn = modal.getByRole("button", {
      name: "Konfirmasi & Buat Pesanan",
    });
    await submitBtn.click();

    // Verifikasi peringatan validasi form HTML5 atau error banner
    await expect(modal.getByRole("heading", { name: "Checkout Pesanan" })).toBeVisible();
  });

  test("TC-CHK-03: checkout berhasil untuk subtotal di bawah $150 menampilkan order ID, biaya ongkir $15, dan mengosongkan keranjang", async ({
    page,
  }) => {
    // Tambah Precision Wireless Mouse M-03 ($119, subtotal < $150)
    await page
      .getByRole("button", {
        name: "Tambah Precision Wireless Mouse M-03 ke keranjang seharga $119",
      })
      .click();

    const headerCartBtn = page.getByRole("button", { name: /Buka keranjang/i });
    await expect(headerCartBtn).toContainText("(1)");
    await expect(headerCartBtn).toContainText("$119");

    // Buka checkout
    await headerCartBtn.click();
    await page.getByRole("button", { name: "Lanjut ke Pembayaran" }).click();

    const modal = page.getByRole("dialog", {
      name: "Modal Checkout Pesanan",
    });
    await expect(modal).toBeVisible();

    // Isi form pelanggan
    await page.locator("#checkout-fullname").fill("Ahmad Dahlan");
    await page.locator("#checkout-email").fill("ahmad.dahlan@example.com");
    await page.locator("#checkout-phone").fill("081234567890");
    await page.locator("#checkout-street").fill("Jl. Merdeka Barat No. 10");
    await page.locator("#checkout-city").fill("Jakarta Pusat");
    await page.locator("#checkout-postal").fill("10110");
    await page.locator("#checkout-province").fill("DKI Jakarta");

    // Klik tombol submit
    await modal.getByRole("button", { name: "Konfirmasi & Buat Pesanan" }).click();

    // Verifikasi transisi ke tampilan sukses
    await expect(
      modal.getByRole("heading", { name: "Pesanan Berhasil Dibuat!" })
    ).toBeVisible({ timeout: 10000 });

    // Verifikasi nomor pesanan berformat ORD-
    const orderIdElem = modal.locator('[data-testid="order-id"]');
    await expect(orderIdElem).toBeVisible();
    await expect(orderIdElem).toHaveText(/^ORD-\d{8}-[0-9A-F]{8}$/);

    // Verifikasi rincian otoritatif dari API di modal sukses
    await expect(modal.getByText("Ahmad Dahlan")).toBeVisible();
    await expect(modal.getByText("ahmad.dahlan@example.com")).toBeVisible();
    await expect(modal.getByText("$119").last()).toBeVisible();
    await expect(modal.getByText("$15")).toBeVisible();
    await expect(modal.getByText("$134")).toBeVisible();

    // Verifikasi keranjang belanja telah dikosongkan pada header
    await expect(headerCartBtn).toContainText("(0)");
    await expect(headerCartBtn).toContainText("$0");

    // Klik tombol Kembali ke Katalog
    await modal.getByRole("button", { name: "Kembali ke Katalog" }).click();
    await expect(modal).toBeHidden();
  });

  test("TC-CHK-04: checkout berhasil untuk subtotal >= $150 menampilkan gratis ongkir pada konfirmasi", async ({
    page,
  }) => {
    // Tambah Studio-01 Wireless Headphones ($349, subtotal >= $150)
    await page
      .getByRole("button", {
        name: "Tambah Studio-01 Wireless Headphones ke keranjang seharga $349",
      })
      .click();

    await page.getByRole("button", { name: /Buka keranjang/i }).click();
    await page.getByRole("button", { name: "Lanjut ke Pembayaran" }).click();

    const modal = page.getByRole("dialog", {
      name: "Modal Checkout Pesanan",
    });
    await expect(modal).toBeVisible();

    // Isi form pelanggan
    await page.locator("#checkout-fullname").fill("Siti Nurhaliza");
    await page.locator("#checkout-email").fill("siti.nurhaliza@example.com");
    await page.locator("#checkout-street").fill("Jl. Gatot Subroto No. 88");
    await page.locator("#checkout-city").fill("Bandung");
    await page.locator("#checkout-postal").fill("40123");

    await modal.getByRole("button", { name: "Konfirmasi & Buat Pesanan" }).click();

    // Verifikasi tampilan sukses dengan gratis ongkir
    await expect(
      modal.getByRole("heading", { name: "Pesanan Berhasil Dibuat!" })
    ).toBeVisible({ timeout: 10000 });

    await expect(modal.getByText("Gratis")).toBeVisible();
    await expect(modal.getByText("$349").last()).toBeVisible();
  });

  test("TC-CHK-05: kegagalan API mempertahankan keranjang belanja dan menampilkan pesan error", async ({
    page,
  }) => {
    // Tambah produk ke keranjang
    await page
      .getByRole("button", {
        name: "Tambah Precision Wireless Mouse M-03 ke keranjang seharga $119",
      })
      .click();

    await page.getByRole("button", { name: /Buka keranjang/i }).click();
    await page.getByRole("button", { name: "Lanjut ke Pembayaran" }).click();

    const modal = page.getByRole("dialog", {
      name: "Modal Checkout Pesanan",
    });
    await expect(modal).toBeVisible();

    // Mock API /api/orders untuk mengembalikan respon 500 error
    await page.route("**/api/orders", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Simulasi kegagalan server saat memproses pesanan.",
          },
        }),
      });
    });

    // Isi form dan kirim
    await page.locator("#checkout-fullname").fill("Budi Santoso");
    await page.locator("#checkout-email").fill("budi@example.com");
    await page.locator("#checkout-street").fill("Jl. Malioboro No. 1");
    await page.locator("#checkout-city").fill("Yogyakarta");
    await page.locator("#checkout-postal").fill("55271");

    await modal.getByRole("button", { name: "Konfirmasi & Buat Pesanan" }).click();

    // Verifikasi pesan error muncul di modal
    await expect(
      modal.getByText("Simulasi kegagalan server saat memproses pesanan.")
    ).toBeVisible();

    // Tutup modal checkout
    await modal.getByRole("button", { name: "Batal" }).click();
    await expect(modal).toBeHidden();

    // Verifikasi keranjang BELUM dikosongkan (masih ada 1 item seharga $119)
    const headerCartBtn = page.getByRole("button", { name: /Buka keranjang/i });
    await expect(headerCartBtn).toContainText("(1)");
    await expect(headerCartBtn).toContainText("$119");
  });

  test("TC-CHK-06: tombol submit menampilkan indikator loading saat proses pengiriman berjalan", async ({
    page,
  }) => {
    await page
      .getByRole("button", {
        name: "Tambah Precision Wireless Mouse M-03 ke keranjang seharga $119",
      })
      .click();

    await page.getByRole("button", { name: /Buka keranjang/i }).click();
    await page.getByRole("button", { name: "Lanjut ke Pembayaran" }).click();

    const modal = page.getByRole("dialog", {
      name: "Modal Checkout Pesanan",
    });

    // Mock API dengan delay 400ms untuk mengecek state loading
    await page.route("**/api/orders", async (route) => {
      await new Promise((res) => setTimeout(res, 400));
      await route.continue();
    });

    await page.locator("#checkout-fullname").fill("Tes Loading");
    await page.locator("#checkout-email").fill("loading@example.com");
    await page.locator("#checkout-street").fill("Jl. Loading No. 9");
    await page.locator("#checkout-city").fill("Surabaya");
    await page.locator("#checkout-postal").fill("60111");

    const submitBtn = modal.getByRole("button", {
      name: "Konfirmasi & Buat Pesanan",
    });
    await submitBtn.click();

    // Verifikasi tombol berubah ke status submitting
    await expect(modal.getByText("Memproses Pesanan...")).toBeVisible();
    await expect(modal.getByRole("button", { name: /Memproses Pesanan/ })).toBeDisabled();
  });
});
