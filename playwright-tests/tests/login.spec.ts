import { test, expect, type Page } from "@playwright/test";
import { AuthHelper } from "../helpers/auth-helper";

test("CAS visible", async ({ page }) => {
  await page.context().clearCookies();
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Log in with CAS" })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Log in with CAS' }).click();
  await expect(page.getByRole('heading', { name: 'Central Authentication Service' })).toBeVisible();


});
test("CAS login", async ({ page }) => {
  const authHelper = new AuthHelper(page);
  await authHelper.loginAsTestUser();
  await expect(page.getByText("YideShare")).toBeVisible();
});
