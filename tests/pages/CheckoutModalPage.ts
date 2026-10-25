import { type Page, type Locator } from "@playwright/test";

export interface CheckoutFormInput {
  fullName: string;
  email: string;
  phone?: string;
  street: string;
  city: string;
  postalCode: string;
  province?: string;
}

export class CheckoutModalPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly heading: Locator;
  readonly closeButton: Locator;

  // Form Fields
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly postalCodeInput: Locator;
  readonly provinceInput: Locator;

  // Form Actions & Alerts
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorBanner: Locator;

  // Confirmation View
  readonly successHeading: Locator;
  readonly orderIdElement: Locator;
  readonly returnToCatalogButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByRole("dialog", {
      name: "Modal Checkout Pesanan",
    });
    this.heading = this.modal.getByRole("heading", {
      name: "Checkout Pesanan",
    });
    this.closeButton = this.modal.getByRole("button", {
      name: "Tutup modal checkout",
    });

    // Form inputs (using verified IDs)
    this.fullNameInput = page.locator("#checkout-fullname");
    this.emailInput = page.locator("#checkout-email");
    this.phoneInput = page.locator("#checkout-phone");
    this.streetInput = page.locator("#checkout-street");
    this.cityInput = page.locator("#checkout-city");
    this.postalCodeInput = page.locator("#checkout-postal");
    this.provinceInput = page.locator("#checkout-province");

    // Action buttons & feedback
    this.submitButton = this.modal.getByRole("button", {
      name: "Konfirmasi & Buat Pesanan",
    });
    this.cancelButton = this.modal.getByRole("button", {
      name: "Batal",
    });
    this.loadingSpinner = this.modal.locator("svg.animate-spin");
    this.errorBanner = this.modal.locator('div[role="alert"]');

    // Success confirmation screen
    this.successHeading = this.modal.getByRole("heading", {
      name: "Pesanan Berhasil Dibuat!",
    });
    this.orderIdElement = this.modal.locator('[data-testid="order-id"]');
    this.returnToCatalogButton = this.modal.getByRole("button", {
      name: "Kembali ke Katalog",
    });
  }

  async fillCustomerForm(data: CheckoutFormInput): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.postalCodeInput.fill(data.postalCode);
    if (data.province) {
      await this.provinceInput.fill(data.province);
    }
  }

  async submitOrder(): Promise<void> {
    await this.submitButton.click();
  }

  async returnToCatalog(): Promise<void> {
    await this.returnToCatalogButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
