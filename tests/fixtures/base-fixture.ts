import { test as baseTest, expect } from "@playwright/test";
import { StorefrontPage } from "../pages/StorefrontPage";
import { CartDrawerPage } from "../pages/CartDrawerPage";
import { CheckoutModalPage } from "../pages/CheckoutModalPage";

/**
 * Custom fixture types defining the pre-instantiated Page Object Models.
 */
export interface CustomFixtures {
  storefrontPage: StorefrontPage;
  cartDrawerPage: CartDrawerPage;
  checkoutModalPage: CheckoutModalPage;
}

/**
 * Extended Playwright test instance equipped with typed Page Object Models.
 * Each test receives fresh, isolated page object instances bound to its unique Page context.
 */
export const test = baseTest.extend<CustomFixtures>({
  storefrontPage: async ({ page }, provide) => {
    const storefrontPage = new StorefrontPage(page);
    await provide(storefrontPage);
  },

  cartDrawerPage: async ({ page }, provide) => {
    const cartDrawerPage = new CartDrawerPage(page);
    await provide(cartDrawerPage);
  },

  checkoutModalPage: async ({ page }, provide) => {
    const checkoutModalPage = new CheckoutModalPage(page);
    await provide(checkoutModalPage);
  },
});

export { expect };
