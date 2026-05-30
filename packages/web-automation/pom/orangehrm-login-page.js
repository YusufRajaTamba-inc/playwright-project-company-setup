export class OrangeHrmLoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.loginErrorMessage = page.locator(
      'p:has-text("Invalid credentials"), p.oxd-alert-content-text, div[role="alert"]'
    );
    this.requiredFieldMessages = page.locator(
      'span:has-text("Required"), .oxd-input-field-error-message'
    );
    this.dashboardTitle = page.locator('h6:has-text("Dashboard")');
  }

  async goto(loginUrl) {
    let lastError;

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        await this.page.goto(loginUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
        });
        await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async submitWithoutCredentials() {
    await this.loginButton.click();
  }
}
