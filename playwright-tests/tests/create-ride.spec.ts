import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context, page }) => {
  // Set the 'user' cookie to simulate a logged-in user
  await page.goto("/api/auth/test-login"); 
  await page.goto("/feed");
});

test("authenticated page loads", async ({ page }) => {
  await expect(page.getByText("YideShare")).toBeVisible();
});
