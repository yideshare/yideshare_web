import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/");
});

test("CAS visible", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Log in with CAS" })
  ).toBeVisible();
});
