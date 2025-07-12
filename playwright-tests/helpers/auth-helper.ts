import { Page } from "@playwright/test";

export class AuthHelper {
  constructor(private page: Page) {}

  async loginAsTestUser() {
    await this.page.goto("/api/auth/test-login");
    await this.page.goto("/feed");
  }
}
