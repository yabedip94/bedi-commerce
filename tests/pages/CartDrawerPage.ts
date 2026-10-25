import { type Page, type Locator } from "@playwright/test";

export class CartDrawerPage {
  readonly page: Page;
  readonly drawer: Locator;
  readonly closeButton: Locator;
  readonly backdrop: Locator;
  readonly emptyStateHeading: Locator;
  readonly startShoppingButton: Locator;
  readonly clearCartButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.drawer = page.getByRole("dialog", {
      name: "Panel Keranjang Belanja",
    });
    this.closeButton = this.drawer.getByRole("button", {
      name: /Tutup keranjang/i,
    });
    this.backdrop = page.locator("div.fixed.inset-0.bg-black\\/40");
    this.emptyStateHeading = this.drawer.getByRole("heading", {
      name: /Keranjang belanja kosong/i,
    });
    this.startShoppingButton = this.drawer.getByRole("button", {
      name: "Mulai Belanja",
    });
    this.clearCartButton = this.drawer.getByRole("button", {
      name: /^Kosongkan/i,
    });
    this.checkoutButton = this.drawer.getByRole("button", {
      name: "Lanjut ke Pembayaran",
    });
    this.cartItems = this.drawer.locator("div.rounded-xl");
  }

  getItemCard(productName: string): Locator {
    return this.drawer.locator("div.rounded-xl", {
      hasText: productName,
    });
  }

  getItemQuantity(productName: string): Locator {
    return this.getItemCard(productName).locator("span").filter({ hasText: /^\d+$/ });
  }

  getItemPrice(productName: string): Locator {
    return this.getItemCard(productName).locator("span.font-medium");
  }

  async incrementItem(productName: string): Promise<void> {
    await this.getItemCard(productName)
      .getByRole("button", { name: "Tambah kuantitas" })
      .click();
  }

  async decrementItem(productName: string): Promise<void> {
    await this.getItemCard(productName)
      .getByRole("button", { name: "Kurangi kuantitas" })
      .click();
  }

  getRemoveItemButton(productName: string): Locator {
    const escaped = productName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return this.getItemCard(productName).getByRole("button", {
      name: new RegExp(`^Hapus ${escaped} dari keranjang`),
    });
  }

  async removeItem(productName: string): Promise<void> {
    await this.getRemoveItemButton(productName).click();
  }

  async clearCart(): Promise<void> {
    await this.clearCartButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async closeViaBackdrop(): Promise<void> {
    await this.backdrop.click({ position: { x: 20, y: 20 } });
  }
}
