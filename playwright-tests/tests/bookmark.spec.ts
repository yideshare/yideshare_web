import { test, expect } from "@playwright/test";
import { SetupTestUser } from "../helpers/testing-init";
import { RideFunctions } from "../helpers/ride-functions";

test.beforeEach(async ({ context, page }) => {
  const setupTestUser = new SetupTestUser(page);
  await setupTestUser.resetDatabase();
  await setupTestUser.loginAsTestUser();
});

test("Bookmark a ride, shows up in Saved Rides", async ({ page }) => {
  const rideFunctions = new RideFunctions(page);
  await rideFunctions.createValidRide();
  //TODO: error when changing num seats
  // await expect(page.getByText("Ride posted successfully!")).toBeVisible(); //TODO maybe add a feature
  await page.getByRole("button").nth(3).click();
  await page.getByRole("link", { name: "Saved Rides" }).click();
  await expect(page.getByText("Bob Dylan")).toBeVisible();
});
