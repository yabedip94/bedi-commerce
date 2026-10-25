import { type Page, type Locator } from "@playwright/test";
import { type ProductCategory } from "@/types/product";

export class StorefrontPage {
  readonly page: Page;

  // Header locators
  readonly header: Locator;
  readonly brandLogo: Locator;
  readonly headerCategorySelect: Locator;
  readonly headerSearchInput: Locator;
  readonly headerClearSearchButton: Locator;
  readonly headerCartButton: Locator;
  readonly cartButton: Locator;
  readonly mobileMenuToggle: Locator;
  readonly mobileSearchInput: Locator;
  readonly navKatalogLink: Locator;
  readonly navSpesifikasiLink: Locator;
  readonly navTentangLink: Locator;

  // Hero locators
  readonly heroSection: Locator;
  readonly heroShopButton: Locator;
  readonly heroAudioButton: Locator;

  // Catalog controls
  readonly catalogSection: Locator;
  readonly catalogSearchInput: Locator;
  readonly catalogClearSearchButton: Locator;
  readonly categoryTablist: Locator;
  readonly inStockOnlyCheckbox: Locator;
  readonly sortSelect: Locator;
  readonly resetFilterButton: Locator;
  readonly productSummaryText: Locator;
  readonly emptyStateHeading: Locator;
  readonly emptyStateResetButton: Locator;

  // Product cards & Toast
  readonly productCards: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.header = page.locator("header");
    this.brandLogo = page.getByRole("button", { name: "Beranda Bedi Commerce" });
    this.headerCategorySelect = page.locator("#header-category-select");
    this.headerSearchInput = this.header.locator('input[type="search"]').first();
    this.headerClearSearchButton = page.getByRole("button", {
      name: "Hapus kata kunci pencarian",
    });
    this.headerCartButton = page.getByRole("button", { name: /Buka keranjang/i });
    this.cartButton = this.headerCartButton;
    this.mobileMenuToggle = page.getByRole("button", { name: "Buka menu navigasi" });
    this.mobileSearchInput = this.header.locator(".md\\:hidden input[type='search']");
    const desktopNav = this.header.locator("nav");
    this.navKatalogLink = desktopNav.getByRole("button", {
      name: "Katalog",
      exact: true,
    });
    this.navSpesifikasiLink = desktopNav.getByRole("link", {
      name: "Spesifikasi",
      exact: true,
    });
    this.navTentangLink = desktopNav.getByRole("link", {
      name: "Tentang",
      exact: true,
    });

    // Hero
    this.heroSection = page.locator("section").first();
    this.heroShopButton = page.getByRole("button", { name: "Lihat Katalog" });
    this.heroAudioButton = page.getByRole("button", { name: /Kategori Audio/i });

    // Catalog
    this.catalogSection = page.locator("#catalog");
    this.catalogSearchInput = page.getByRole("searchbox", { name: "Cari produk" });
    this.catalogClearSearchButton = page.getByRole("button", { name: "Hapus pencarian" });
    this.categoryTablist = page.getByRole("tablist", {
      name: "Filter kategori produk",
    });
    this.inStockOnlyCheckbox = page.getByLabel("Hanya stok tersedia");
    this.sortSelect = page.getByLabel("Urutkan produk");
    this.resetFilterButton = page.getByRole("button", { name: "Reset Filter" });
    this.productSummaryText = page.getByText(/Menampilkan \d+ dari \d+ produk pilihan/);
    this.emptyStateHeading = page.getByRole("heading", {
      level: 3,
      name: "Produk tidak ditemukan",
    });
    this.emptyStateResetButton = page.getByRole("button", {
      name: "Reset Semua Filter",
    });

    // Product cards & Toast
    this.productCards = page.getByRole("article");
    this.toast = page.getByRole("status");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  getCategoryTab(category: "Semua" | ProductCategory): Locator {
    return this.categoryTablist.getByRole("tab", {
      name: new RegExp(`^${category}`),
    });
  }

  getProductCard(productName: string): Locator {
    return this.page.getByRole("article", { name: productName });
  }

  getAddToCartButton(productName: string, price?: number): Locator {
    const escaped = escapeRegExp(productName);
    const pattern =
      price !== undefined
        ? `^Tambah ${escaped} ke keranjang seharga \\$${price}`
        : `^Tambah ${escaped}`;
    return this.page.getByRole("button", {
      name: new RegExp(pattern),
    });
  }

  async searchInCatalog(query: string): Promise<void> {
    await this.catalogSearchInput.fill(query);
  }

  async searchInHeader(query: string): Promise<void> {
    await this.headerSearchInput.fill(query);
  }

  async selectHeaderCategory(category: "Semua" | ProductCategory): Promise<void> {
    await this.headerCategorySelect.selectOption(category);
  }

  async selectCatalogCategory(category: "Semua" | ProductCategory): Promise<void> {
    await this.getCategoryTab(category).click();
  }

  async setInStockOnly(checked: boolean): Promise<void> {
    const isChecked = await this.inStockOnlyCheckbox.isChecked();
    if (isChecked !== checked) {
      if (checked) {
        await this.inStockOnlyCheckbox.check();
      } else {
        await this.inStockOnlyCheckbox.uncheck();
      }
    }
  }

  async selectSortOption(
    option: "featured" | "price-asc" | "price-desc" | "rating"
  ): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async resetFilters(): Promise<void> {
    await this.resetFilterButton.click();
  }

  async addProductToCart(productName: string, price?: number): Promise<void> {
    await this.getAddToCartButton(productName, price).click();
  }

  async openCart(): Promise<void> {
    await this.headerCartButton.click();
  }
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
