import { defineConfig, devices } from "@playwright/test";
import fs from "fs";

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Pastikan build produksi ada sebelum server dinyalakan.
// Pada clean checkout atau CI, lakukan build otomatis jika folder .next belum ada.
const hasProductionBuild = fs.existsSync(".next");
const webServerCommand = !hasProductionBuild
  ? `npm run build && npx next start -p ${PORT}`
  : `npx next start -p ${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: webServerCommand,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
