import { test, expect } from '@playwright/test';
import { getEnvConfig } from '@automation/common-module';
import { OrangeHrmLoginPage } from '../pom/orangehrm-login-page.js';

const envConfig = getEnvConfig();
const loginUrl = envConfig.BASE_URL;
const username = envConfig.USERNAME;
const password = envConfig.PASSWORD;

test.describe('OrangeHRM Login', () => {
  test.setTimeout(60000);

  test.skip(
    !loginUrl || !username || !password,
    'Set BASE_URL, USERNAME, and PASSWORD in packages/common-module/config/env.sit.json (or env.uat.json).'
  );

  test('[smoke] user can login with valid credential', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);

    await loginPage.goto(loginUrl);
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/\/dashboard/i);
    await expect(loginPage.dashboardTitle).toBeVisible();
  });

  test('[negative] user cannot login with invalid password', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);

    await loginPage.goto(loginUrl);
    await loginPage.login(username, 'wrong-password');

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(page).not.toHaveURL(/\/dashboard/i);
    await expect(page).toHaveURL(/\/auth\/(login|validate)/i);
  });

  test('[negative] user sees required validation when fields are empty', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);

    await loginPage.goto(loginUrl);
    await loginPage.submitWithoutCredentials();

    await expect(loginPage.requiredFieldMessages.first()).toBeVisible();
  });
});
