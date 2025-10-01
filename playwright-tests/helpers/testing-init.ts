import { Page } from "@playwright/test";

export class SetupTestUser {
  constructor(private page: Page) {}

  async resetDatabase() {
    await this.page.request.post("/api/test-utils/reset-db", {
      headers: { "x-test-utils-secret": process.env.PLAYWRIGHT_SECRET ?? "" },
    });
  }

  async loginAsTestUser() {
    const token = process.env.DEV_TEST_LOGIN_SECRET ?? "";
    await this.page.goto(
      `/api/auth/test-login${
        token ? `?token=${encodeURIComponent(token)}` : ""
      }`
    );
    await this.page.goto("/feed");
  }
}
