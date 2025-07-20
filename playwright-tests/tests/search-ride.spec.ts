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
  await helper(page, "12:00 AM", "01:00 AM");
  await expect(page.getByText("Bob Dylan")).toBeVisible();
});

test("Search Ride - time in range (within 15 minutes)", async ({ page }) => {
  await helper(page, "12:15 AM", "01:15 AM");
  await expect(page.getByText("Bob Dylan")).toBeVisible();
});

test("Search Ride - time overlapping window", async ({ page }) => {
  await helper(page, "12:15 AM", "12:45 AM");
  await expect(page.getByText("Bob Dylan")).toBeVisible();
});

test("Search Ride - time out of range", async ({ page }) => {
  await helper(page, "01:15 AM", "02:15 AM");
  await expect(page.getByText("Bob Dylan")).toBeHidden();
});
async function helper(page: any, startTime: string, endTime: string) {
  const rideFunctions = new RideFunctions(page);
  await rideFunctions.createValidRideViaPopup();
  await rideFunctions.fillNavBarMinusTime();

  await page.getByRole("combobox").filter({ hasText: "Select time" }).click();
  await page
    .getByRole("combobox", { name: "Select earliest departure time" })
    .click();
  await page.getByRole("option", { name: startTime }).click();

  await page
    .getByRole("combobox", { name: "Select latest departure time" })
    .click();
  await page.getByText(endTime).click();
  await page.getByRole("button", { name: "Search" }).click();

  await expect(
    page.getByRole("button", { name: "Clear Search" })
  ).toBeVisible();
}
