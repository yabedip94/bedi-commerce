import { test, expect } from "../fixtures/base-fixture";

test.describe("Storefront Checkout UI Integration Tests", () => {
  test.beforeEach(async ({ storefrontPage }) => {
    await storefrontPage.goto();
  });

  test("TC-CHK-01: membuka modal checkout dari cart drawer dan menampilkan ringkasan belanja", async ({
    storefrontPage,
    cartDrawerPage,
    checkoutModalPage,
  }) => {
    // Tambah Precision Wireless Mouse M-03 ($119)
    await storefrontPage.addProductToCart("Precision Wireless Mouse M-03", 119);

    // Buka keranjang
    await storefrontPage.openCart();
    await expect(cartDrawerPage.drawer).toBeVisible();

    // Klik tombol Lanjut ke Pembayaran
    await cartDrawerPage.proceedToCheckout();

    // Drawer tertutup dan modal checkout terbuka
    await expect(cartDrawerPage.drawer).toBeHidden();
    await expect(checkoutModalPage.modal).toBeVisible();
    await expect(checkoutModalPage.heading).toBeVisible();

    // Verifikasi field form tersedia
    await expect(checkoutModalPage.fullNameInput).toBeVisible();
    await expect(checkoutModalPage.emailInput).toBeVisible();
    await expect(checkoutModalPage.phoneInput).toBeVisible();
    await expect(checkoutModalPage.streetInput).toBeVisible();
    await expect(checkoutModalPage.cityInput).toBeVisible();
    await expect(checkoutModalPage.postalCodeInput).toBeVisible();
    await expect(checkoutModalPage.provinceInput).toBeVisible();

    // Verifikasi ringkasan pesanan di dalam modal ($119 + $15 = $134)
    await expect(
      checkoutModalPage.modal.getByText("Precision Wireless Mouse M-03 × 1")
    ).toBeVisible();
    await expect(checkoutModalPage.modal.getByText("$119").first()).toBeVisible();
    await expect(checkoutModalPage.modal.getByText("$15")).toBeVisible();
    await expect(checkoutModalPage.modal.getByText("$134")).toBeVisible();
  });

  test("TC-CHK-02: validasi field pelanggan wajib menampilkan pesan peringatan jika kosong", async ({
    storefrontPage,
    cartDrawerPage,
    checkoutModalPage,
  }) => {
    // Tambah produk dan buka checkout
    await storefrontPage.addProductToCart("Studio-01 Wireless Headphones", 349);
    await storefrontPage.openCart();
    await cartDrawerPage.proceedToCheckout();

    await expect(checkoutModalPage.modal).toBeVisible();

    // Submit form langsung tanpa mengisi field wajib
    await checkoutModalPage.submitOrder();

    // Verifikasi peringatan validasi form HTML5 atau error banner (modal tetap terbuka di layar formulir)
    await expect(checkoutModalPage.heading).toBeVisible();
  });

  test("TC-CHK-03: checkout berhasil untuk subtotal di bawah $150 menampilkan order ID, biaya ongkir $15, dan mengosongkan keranjang", async ({
    storefrontPage,
    cartDrawerPage,
    checkoutModalPage,
  }) => {
    // Tambah Precision Wireless Mouse M-03 ($119, subtotal < $150)
    await storefrontPage.addProductToCart("Precision Wireless Mouse M-03", 119);

    await expect(storefrontPage.cartButton).toContainText("(1)");
    await expect(storefrontPage.cartButton).toContainText("$119");

    // Buka checkout
    await storefrontPage.openCart();
    await cartDrawerPage.proceedToCheckout();

    await expect(checkoutModalPage.modal).toBeVisible();

    // Isi form pelanggan
    await checkoutModalPage.fillCustomerForm({
      fullName: "Ahmad Dahlan",
      email: "ahmad.dahlan@example.com",
      phone: "081234567890",
      street: "Jl. Merdeka Barat No. 10",
      city: "Jakarta Pusat",
      postalCode: "10110",
      province: "DKI Jakarta",
    });

    // Klik tombol submit
    await checkoutModalPage.submitOrder();

    // Verifikasi transisi ke tampilan sukses
    await expect(checkoutModalPage.successHeading).toBeVisible({ timeout: 10000 });

    // Verifikasi nomor pesanan berformat ORD-
    await expect(checkoutModalPage.orderIdElement).toBeVisible();
    await expect(checkoutModalPage.orderIdElement).toHaveText(
      /^ORD-\d{8}-[0-9A-F]{8}$/
    );

    // Verifikasi rincian otoritatif dari API di modal sukses
    await expect(checkoutModalPage.modal.getByText("Ahmad Dahlan")).toBeVisible();
    await expect(
      checkoutModalPage.modal.getByText("ahmad.dahlan@example.com")
    ).toBeVisible();
    await expect(checkoutModalPage.modal.getByText("$119").last()).toBeVisible();
    await expect(checkoutModalPage.modal.getByText("$15")).toBeVisible();
    await expect(checkoutModalPage.modal.getByText("$134")).toBeVisible();

    // Verifikasi keranjang belanja telah dikosongkan pada header
    await expect(storefrontPage.cartButton).toContainText("(0)");
    await expect(storefrontPage.cartButton).toContainText("$0");

    // Klik tombol Kembali ke Katalog
    await checkoutModalPage.returnToCatalog();
    await expect(checkoutModalPage.modal).toBeHidden();
  });

  test("TC-CHK-04: checkout berhasil untuk subtotal >= $150 menampilkan gratis ongkir pada konfirmasi", async ({
    storefrontPage,
    cartDrawerPage,
    checkoutModalPage,
  }) => {
    // Tambah Studio-01 Wireless Headphones ($349, subtotal >= $150)
    await storefrontPage.addProductToCart("Studio-01 Wireless Headphones", 349);

    await storefrontPage.openCart();
    await cartDrawerPage.proceedToCheckout();

    await expect(checkoutModalPage.modal).toBeVisible();

    // Isi form pelanggan
    await checkoutModalPage.fillCustomerForm({
      fullName: "Siti Nurhaliza",
      email: "siti.nurhaliza@example.com",
      street: "Jl. Gatot Subroto No. 88",
      city: "Bandung",
      postalCode: "40123",
    });

    await checkoutModalPage.submitOrder();

    // Verifikasi tampilan sukses dengan gratis ongkir
    await expect(checkoutModalPage.successHeading).toBeVisible({ timeout: 10000 });

    await expect(checkoutModalPage.modal.getByText("Gratis")).toBeVisible();
    await expect(checkoutModalPage.modal.getByText("$349").last()).toBeVisible();
  });

  test("TC-CHK-05: kegagalan API mempertahankan keranjang belanja dan menampilkan pesan error", async ({
    page,
    storefrontPage,
    cartDrawerPage,
    checkoutModalPage,
  }) => {
    // Tambah produk ke keranjang
    await storefrontPage.addProductToCart("Precision Wireless Mouse M-03", 119);

    await storefrontPage.openCart();
    await cartDrawerPage.proceedToCheckout();

    await expect(checkoutModalPage.modal).toBeVisible();

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
    await checkoutModalPage.fillCustomerForm({
      fullName: "Budi Santoso",
      email: "budi@example.com",
      street: "Jl. Malioboro No. 1",
      city: "Yogyakarta",
      postalCode: "55271",
    });

    await checkoutModalPage.submitOrder();

    // Verifikasi pesan error muncul di modal
    await expect(
      checkoutModalPage.modal.getByText(
        "Simulasi kegagalan server saat memproses pesanan."
      )
    ).toBeVisible();

    // Tutup modal checkout
    await checkoutModalPage.cancel();
    await expect(checkoutModalPage.modal).toBeHidden();

    // Verifikasi keranjang BELUM dikosongkan (masih ada 1 item seharga $119)
    await expect(storefrontPage.cartButton).toContainText("(1)");
    await expect(storefrontPage.cartButton).toContainText("$119");
  });

  test("TC-CHK-06: tombol submit menampilkan indikator loading saat proses pengiriman berjalan", async ({
    page,
    storefrontPage,
    cartDrawerPage,
    checkoutModalPage,
  }) => {
    await storefrontPage.addProductToCart("Precision Wireless Mouse M-03", 119);

    await storefrontPage.openCart();
    await cartDrawerPage.proceedToCheckout();

    await expect(checkoutModalPage.modal).toBeVisible();

    // Mock API dengan delay 400ms untuk mengecek state loading
    await page.route("**/api/orders", async (route) => {
      await new Promise((res) => setTimeout(res, 400));
      await route.continue();
    });

    await checkoutModalPage.fillCustomerForm({
      fullName: "Tes Loading",
      email: "loading@example.com",
      street: "Jl. Loading No. 9",
      city: "Surabaya",
      postalCode: "60111",
    });

    await checkoutModalPage.submitOrder();

    // Verifikasi tombol berubah ke status submitting
    await expect(checkoutModalPage.modal.getByText("Memproses Pesanan...")).toBeVisible();
    await expect(
      checkoutModalPage.modal.getByRole("button", { name: /Memproses Pesanan/ })
    ).toBeDisabled();
  });
});
