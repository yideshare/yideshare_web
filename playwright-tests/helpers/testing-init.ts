import { Page } from "@playwright/test";
export class SetupTestUser {
  constructor(private page: Page) {}

  async loginAsTestUser() {
    await this.page.goto("/api/auth/test-login");
    await this.page.goto("/feed");
  }
  async resetDatabase() {
    await this.page.request.post("/api/test-utils/reset-db");
  }
}
