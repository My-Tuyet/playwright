import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState();
});

test('c01', async ({ page }) => {
await expect(page).toHaveURL('./contact');
const expectedTextRegex = /Information:[\s\S]*Please do not select "start application" unless you intend to complete all components of the application, including recording two videos./;
await expect.soft(page.locator('.notification_container')).toHaveText(expectedTextRegex);
});