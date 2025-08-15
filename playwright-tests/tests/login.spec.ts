import { test, expect, type Page } from "@playwright/test";
import { SetupTestUser } from "../helpers/testing-init";

test("CAS visible", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Login" })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Central Authentication Service' })).toBeVisible();
});
test("fake CAS login", async ({ page }) => {
  const setupTestUser = new SetupTestUser(page);
  await setupTestUser.loginAsTestUser();
  await expect(page.getByText("YideShare")).toBeVisible();
});
