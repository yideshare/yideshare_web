import { test, expect } from "@playwright/test";
import { SetupTestUser } from "../helpers/testing-init";
import { RideFunctions } from "../helpers/ride-functions";
test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ context, page }) => {
  const setupTestUser = new SetupTestUser(page);
  await setupTestUser.resetDatabase();
  await setupTestUser.loginAsTestUser();
});

test("Search Ride - exact posting time", async ({ page }) => {
  const rideFunctions = new RideFunctions(page);
  await rideFunctions.createValidRideViaPopup(); // defaults to today
  await rideFunctions.fillNavBarMinusTime();

  //Easy time selection
  await page.getByRole("combobox").filter({ hasText: "Select time" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Earliest departure--:--$/ })
    .getByRole("combobox")
    .click();
  await page.getByRole("option", { name: "12:00 AM" }).click();
  await page.getByRole("combobox").filter({ hasText: "--:--" }).click();
  await page.getByText("01:00 AM").click();
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Bob Dylan")).toBeVisible();
});
//TODO: add more tests for search ride

