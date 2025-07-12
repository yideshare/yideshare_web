import { test, expect } from "@playwright/test";
import { AuthHelper } from "../helpers/auth-helper";

test.beforeEach(async ({ context, page }) => {
  await page.request.post("/api/test-utils/reset-db");
  const authHelper = new AuthHelper(page);
  await authHelper.loginAsTestUser();
});

test("Correct buttons exist", async ({ page }) => {
  await expect(
    page.locator("label").filter({ hasText: "Leaving from" })
  ).toBeVisible();
  await expect(
    page.locator("label").filter({ hasText: "Going to" })
  ).toBeVisible();
  await expect(page.locator("label").filter({ hasText: "Date" })).toBeVisible();
  await expect(
    page.locator("label").filter({ hasText: "Departure Time Range (EST)" })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Post Ride" })).toBeVisible();
});
test("Popup appears when clicking Post Ride", async ({ page }) => {
  await page.getByRole("button", { name: "Post Ride" }).click();
  await expect(
    page.getByRole("heading", { name: "Share a Yide" })
  ).toBeVisible();
  await expect(
    page.locator("div").filter({ hasText: /^Post Yide$/ })
  ).toBeVisible();
});
test("Create Valid Ride", async ({ page }) => {
  await page.getByRole("button", { name: "Post Ride" }).click();
  await page
    .getByRole("textbox", { name: "Organizer name (optional)" })
    .fill("Bob Dylan");
  await page.locator('input[type="tel"]').click();
  await page.locator('input[type="tel"]').fill("+1 615 123 4567");
  await page.getByRole("textbox", { name: "Leaving from *" }).click();
  await page.getByRole("textbox", { name: "Leaving from *" }).fill("Vegas");
  await page.getByRole("textbox", { name: "Heading to *" }).click();
  await page.getByRole("textbox", { name: "Heading to *" }).fill("Miami");
  await page.getByRole("combobox").nth(1).click();
  await page.getByRole("option", { name: "12:00 AM" }).click();
  await page.getByRole("combobox").filter({ hasText: "--:--" }).click();
  await page.getByLabel("01:00 AM").getByText(":00 AM").click();
  await page.getByRole("button", { name: "Post Yide" }).click();
  //TODO: error when changing num seats
  // await expect(page.getByText("Ride posted successfully!")).toBeVisible(); //TODO maybe add a feature
  await expect(page.getByRole("link", { name: "Yideshare" })).toBeVisible();
});
