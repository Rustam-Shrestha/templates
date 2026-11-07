import { test, expect } from "@playwright/test";

test.describe("ERP Control Plane Frontend E2E (§5)", () => {
  test("should render the Enterprise ERP Control Plane home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Enterprise ERP Control Plane");
    await expect(page.locator("h2")).toContainText("ERP Infrastructure Telemetry");
  });
});

