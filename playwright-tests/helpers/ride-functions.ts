import { Page } from "@playwright/test";
export class RideFunctions {
  constructor(private page: Page) {}

  getTodayDayNumber(): string {
    const today = new Date();
    return today.getDate().toString();
  }
  async createValidRideViaPopup() {
    await this.page.getByRole("button", { name: "Post Ride" }).click();
    await this.page
      .getByRole("textbox", { name: "Organizer name (optional)" })
      .fill("Bob Dylan");
    await this.page.locator('input[type="tel"]').click();
    await this.page.locator('input[type="tel"]').fill("+1 615 123 4567");
    await this.page.getByRole("textbox", { name: "Leaving from *" }).click();
    await this.page
      .getByRole("textbox", { name: "Leaving from *" })
      .fill("Vegas");
    await this.page.getByRole("textbox", { name: "Heading to *" }).click();
    await this.page
      .getByRole("textbox", { name: "Heading to *" })
      .fill("Miami");
    await this.page.getByRole("combobox").nth(1).click();
    await this.page.getByRole("option", { name: "12:00 AM" }).click();
    await this.page.getByRole("combobox").filter({ hasText: "--:--" }).click();
    await this.page.getByLabel("01:00 AM").getByText(":00 AM").click();
    await this.page
      .getByRole("spinbutton", { name: "Number of Open Seats *" })
      .click();
    await this.page
      .getByRole("spinbutton", { name: "Number of Open Seats *" })
      .fill("4");
    await this.page.getByRole("button", { name: "Post Ride" }).click();
  }
  async fillNavBarMinusTime() {
    await this.page.getByRole("combobox", { name: "Select departure date" }).click();
    const dayNumber = this.getTodayDayNumber();
    await this.page.getByRole("gridcell", { name: dayNumber }).click();

    await this.page
      .locator("div")
      .filter({ hasText: /^Leaving from$/ })
      .getByRole("combobox")
      .click();
    await this.page.getByPlaceholder("Search or type to create…").fill("Vegas");
    await this.page.getByPlaceholder("Search or type to create…").press("Enter");
    await this.page.getByPlaceholder("Search or type to create…").fill("Miami");
    await this.page.getByPlaceholder("Search or type to create…").press("Enter");
  }
}
