import { test, expect } from "@playwright/test";

test.describe("Storefront Interactive Functionality Regression Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Add to Cart & State Updates", () => {
    test("menambahkan produk menambah counter cart, subtotal, dan menampilkan toast", async ({
      page,
    }) => {
      const cartButton = page.getByRole("button", {
        name: /Buka keranjang/i,
      });

      // 1. Catat kondisi awal cart (0 produk, $0)
      await expect(cartButton).toContainText("Keranjang");
      await expect(cartButton).toContainText("(0)");
      await expect(cartButton).toContainText("$0");

      // 2. Klik tombol 'Tambah' pada produk Studio-01 Wireless Headphones ($349)
      const addButton = page.getByRole("button", {
        name: "Tambah Studio-01 Wireless Headphones ke keranjang seharga $349",
      });
      await expect(addButton).toBeVisible();
      await addButton.click();

      // 3. Verifikasi tombol berubah status menjadi 'Ditambahkan'
      await expect(addButton).toContainText("Ditambahkan");

      // 4. Verifikasi toast notifikasi muncul
      const toast = page.getByRole("status");
      await expect(toast).toBeVisible();
      await expect(toast).toContainText(
        '"Studio-01 Wireless Headphones" ditambahkan ke keranjang'
      );

      // 5. Verifikasi cart counter dan subtotal di header terbarui menjadi 1 item ($349)
      await expect(cartButton).toContainText("(1)");
      await expect(cartButton).toContainText("$349");

      // 6. Tambahkan produk yang sama kedua kalinya
      // Tunggu transisi tombol kembali menjadi 'Tambah' setelah 1.4s
      await expect(addButton).toContainText("Tambah");
      await addButton.click();

      // 7. Verifikasi counter bertambah menjadi 2 dan subtotal menjadi $698 ($349 x 2)
      await expect(cartButton).toContainText("(2)");
      await expect(cartButton).toContainText("$698");
    });
  });

  test.describe("Cart Drawer Lifecycle", () => {
    test("membuka keranjang saat kosong menampilkan empty state dan dapat ditutup", async ({
      page,
    }) => {
      const cartButton = page.getByRole("button", {
        name: /Buka keranjang/i,
      });

      // Buka drawer saat keranjang masih kosong
      await cartButton.click();

      const drawer = page.getByRole("dialog", {
        name: "Panel Keranjang Belanja",
      });
      await expect(drawer).toBeVisible();

      // Verifikasi komponen empty state terlihat
      await expect(
        drawer.getByRole("heading", {
          level: 3,
          name: "Keranjang belanja kosong",
        })
      ).toBeVisible();
      await expect(
        drawer.getByRole("button", { name: "Mulai Belanja" })
      ).toBeVisible();

      // Tutup drawer menggunakan tombol close
      const closeButton = drawer.getByRole("button", {
        name: "Tutup keranjang",
      });
      await closeButton.click();

      // Verifikasi dialog tertutup
      await expect(drawer).toBeHidden();
    });

    test("membuka keranjang setelah menambah produk menampilkan rincian item, kuantitas, dan subtotal", async ({
      page,
    }) => {
      // Tambah produk K-75 Mechanical Keyboard ($189)
      const addButton = page.getByRole("button", {
        name: "Tambah K-75 Mechanical Keyboard ke keranjang seharga $189",
      });
      await addButton.click();

      // Buka drawer
      const cartButton = page.getByRole("button", {
        name: /Buka keranjang/i,
      });
      await cartButton.click();

      const drawer = page.getByRole("dialog", {
        name: "Panel Keranjang Belanja",
      });
      await expect(drawer).toBeVisible();

      // Verifikasi item di dalam drawer
      await expect(
        drawer.getByRole("heading", {
          level: 4,
          name: "K-75 Mechanical Keyboard",
        })
      ).toBeVisible();
      await expect(drawer.getByText("$189 per unit")).toBeVisible();

      // Verifikasi subtotal dan gratis ongkir aktif (karena $189 >= $150)
      await expect(
        drawer.getByText("Gratis ongkos kirim aktif (pesanan di atas $150)")
      ).toBeVisible();
      await expect(drawer.getByText("$189").last()).toBeVisible();
    });
  });

  test.describe("Hero & Navigation Target Verification", () => {
    test("tombol Hero 'Lihat Katalog' melakukan scroll halus ke section katalog", async ({
      page,
    }) => {
      const heroButton = page.getByRole("button", { name: "Lihat Katalog" });
      await expect(heroButton).toBeVisible();

      // Posisi scroll awal di bagian atas
      const initialScrollY = await page.evaluate(() => window.scrollY);
      expect(initialScrollY).toBe(0);

      await heroButton.click();

      // Section katalog (#catalog) harus berada di viewport
      const catalogSection = page.locator("#catalog");
      await expect(catalogSection).toBeInViewport();

      // Input pencarian katalog menerima fokus setelah scroll selesai
      const catalogSearchInput = catalogSection.getByRole("searchbox", {
        name: "Cari produk",
      });
      await expect(catalogSearchInput).toBeFocused();

      // Posisi scroll telah berpindah ke bawah
      const afterScrollY = await page.evaluate(() => window.scrollY);
      expect(afterScrollY).toBeGreaterThan(0);
    });

    test("navigasi header desktop (Katalog, Spesifikasi, Tentang) mengarah ke section yang benar", async ({
      page,
    }) => {
      // Set viewport desktop 1280px
      await page.setViewportSize({ width: 1280, height: 800 });

      const headerNav = page.locator("header nav");

      // 1. Klik Katalog
      const katalogBtn = headerNav.getByRole("button", { name: "Katalog" });
      await katalogBtn.click();
      await expect(page.locator("#catalog")).toBeInViewport();

      // 2. Klik Spesifikasi
      const spesifikasiLink = headerNav.getByRole("link", {
        name: "Spesifikasi",
      });
      await spesifikasiLink.click();
      await expect(page).toHaveURL(/#informasi/);
      await expect(page.locator("#informasi")).toBeInViewport();

      // 3. Klik Tentang
      const tentangLink = headerNav.getByRole("link", { name: "Tentang" });
      await tentangLink.click();
      await expect(page).toHaveURL(/#tentang/);
      await expect(page.locator("#tentang")).toBeInViewport();
    });

    const viewports = [
      { name: "390px (Mobile)", width: 390, height: 844, isMobile: true },
      { name: "768px (Tablet Portrait)", width: 768, height: 1024, isMobile: true },
      { name: "900px (Tablet Landscape)", width: 900, height: 600, isMobile: true },
      { name: "1024px (Small Desktop)", width: 1024, height: 768, isMobile: false },
      { name: "1280px (Standard Desktop)", width: 1280, height: 800, isMobile: false },
    ];

    for (const vp of viewports) {
      test(`navigasi header dapat diakses pada ukuran layar ${vp.name}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        if (vp.isMobile) {
          // Pada mobile/tablet (< 1024px): tombol hamburger harus terlihat
          const menuToggle = page.getByRole("button", {
            name: "Buka menu navigasi",
          });
          await expect(menuToggle).toBeVisible();

          // Buka menu navigasi mobile/tablet
          await menuToggle.click();

          // Verifikasi link Katalog, Spesifikasi, dan Tentang dapat diakses di menu
          const menuPanel = page.locator("header .lg\\:hidden").last();
          await expect(
            menuPanel.getByRole("button", { name: "Katalog" })
          ).toBeVisible();
          await expect(
            menuPanel.getByRole("link", { name: "Spesifikasi" })
          ).toBeVisible();
          await expect(
            menuPanel.getByRole("link", { name: "Tentang" })
          ).toBeVisible();
        } else {
          // Pada desktop (>= 1024px): desktop nav terlihat langsung
          const headerNav = page.locator("header nav");
          await expect(headerNav).toBeVisible();
          await expect(
            headerNav.getByRole("button", { name: "Katalog" })
          ).toBeVisible();
          await expect(
            headerNav.getByRole("link", { name: "Spesifikasi" })
          ).toBeVisible();
          await expect(
            headerNav.getByRole("link", { name: "Tentang" })
          ).toBeVisible();
        }
      });
    }
  });
});
