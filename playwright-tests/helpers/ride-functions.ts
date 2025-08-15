import { Page, expect } from "@playwright/test";
export class RideFunctions {
  constructor(private page: Page) {}

  getTodayDayNumber(): string {
    const today = new Date();
    return today.getDate().toString();
  }

  async createValidRideViaPopup() {
    const openBtn = this.page.getByRole("button", { name: /^post ride$/i });
    await openBtn.waitFor({ state: "visible" });
    await openBtn.click();

    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog
      .getByRole("textbox", { name: /organizer name/i })
      .fill("Bob Dylan");
    await dialog.locator('input[type="tel"]').fill("+1 615 123 4567");
    await dialog
      .getByRole("textbox", { name: /leaving from \*/i })
      .fill("Vegas");
    await dialog.getByRole("textbox", { name: /heading to \*/i }).fill("Miami");

    await dialog.getByRole("combobox").nth(1).click();
    await this.page.getByRole("option", { name: "12:00 AM" }).click();

    await dialog.getByRole("combobox").filter({ hasText: /--:--/ }).click();
    await this.page.getByRole("option", { name: "01:00 AM" }).click();

    await dialog
      .getByRole("spinbutton", { name: /number of open seats \*/i })
      .fill("4");

    await dialog.getByRole("button", { name: /^post ride$/i }).click();

    await expect(dialog).toBeHidden();
  }

  async fillNavBarMinusTime() {
    await this.page
      .getByRole("combobox", { name: /select departure date/i })
      .click();
    const dayNumber = this.getTodayDayNumber();
    await this.page.getByRole("gridcell", { name: dayNumber }).click();
    await this.page.keyboard.press("Escape");

    await this.page
      .getByRole("combobox", { name: /select departure location/i })
      .click();
    const departureInput = this.page
      .getByPlaceholder("Search or type to create…")
      .first();
    await departureInput.waitFor({ state: "visible" });
    await departureInput.fill("Vegas");
    await departureInput.press("Enter");
    await this.page.waitForLoadState("networkidle");

    await this.page
      .getByRole("combobox", { name: /select destination location/i })
      .click();
    const destinationInput = this.page
      .getByPlaceholder("Search or type to create…")
      .last();
    await destinationInput.waitFor({ state: "visible" });
    await destinationInput.fill("Miami");
    await destinationInput.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }
}
