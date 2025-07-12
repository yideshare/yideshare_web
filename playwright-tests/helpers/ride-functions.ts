import { Page } from "@playwright/test";
export class RideFunctions {
  constructor(private page: Page) {}

  async createValidRide() {
    await this.page.getByRole("button", { name: "Post Ride" }).click();
    await this.page
      .getByRole("textbox", { name: "Organizer name (optional)" })
      .fill("Bob Dylan");
    await this.page.locator('input[type="tel"]').click();
    await this.page.locator('input[type="tel"]').fill("+1 615 123 4567");
    await this.page.getByRole("textbox", { name: "Leaving from *" }).click();
    await this.page.getByRole("textbox", { name: "Leaving from *" }).fill("Vegas");
    await this.page.getByRole("textbox", { name: "Heading to *" }).click();
    await this.page.getByRole("textbox", { name: "Heading to *" }).fill("Miami");
    await this.page.getByRole("combobox").nth(1).click();
    await this.page.getByRole("option", { name: "12:00 AM" }).click();
    await this.page.getByRole("combobox").filter({ hasText: "--:--" }).click();
    await this.page.getByLabel("01:00 AM").getByText(":00 AM").click();
    await this.page.getByRole("button", { name: "Post Yide" }).click();
  }
}
