import { test, expect, type Page } from "@playwright/test";
import { SetupTestUser } from "../helpers/testing-init";

test("logout", async ({ page }) => {
  const setupTestUser = new SetupTestUser(page);
  await setupTestUser.loginAsTestUser();
  await expect(page.getByText("YideShare")).toBeVisible();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
