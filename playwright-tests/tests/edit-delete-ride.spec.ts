import { test, expect } from "@playwright/test";
import { SetupTestUser } from "../helpers/testing-init";
import { RideFunctions } from "../helpers/ride-functions";
test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context, page }) => {
  const setupTestUser = new SetupTestUser(page);
  await setupTestUser.resetDatabase();
  await setupTestUser.loginAsTestUser();
});

test("Create Valid Ride", async ({ page }) => {
  const rideFunctions = new RideFunctions(page);
  await rideFunctions.createValidRide();
  await expect(page.getByRole("link", { name: "Yideshare" })).toBeVisible();
  await expect(page.getByText("Bob Dylan").first()).toBeVisible();
});

test("Created ride shows up in Your Rides", async ({ page }) => {
  const rideFunctions = new RideFunctions(page);
  await rideFunctions.createValidRide();
  await page.getByRole("link", { name: "My Posts" }).click();
  await expect(page.getByText("Bob Dylan").first()).toBeVisible();
});
