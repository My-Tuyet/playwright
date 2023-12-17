import { test, expect } from '@playwright/test';

test('01', async ({ page }) => {
await page.goto('/');
await page.waitForLoadState();
let src = await page.locator('.header-left').getByAltText('navigation', { exact: true }).getAttribute('src');
await expect.soft(src).toEqual('/images/navigation.svg')
});

test('02-05', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await page.getByRole('button', { name: 'navigation' }).click();
    await expect.soft(await page.locator('.nav-bar.active').getByAltText('Close').getAttribute('src')).toEqual('/images/navigation-close.svg');
    await expect.soft(await page.locator('.nav-bar.active').getByAltText('Dr. Berg small logo').getAttribute('src')).toEqual('https://drberg-dam.imgix.net/dr-berg-images/logo-48-small.svg');
    await expect.soft(page.locator('.nav-bar.active ul > li > a')).toContainText(['Home', 'Open positions','About']);
    //console.log (await page.locator('ul > li > a[href="/"]').getAttribute('href'));
    await expect.soft(await page.locator('ul > li > a[href="/"]').getAttribute('href')).toEqual("/");
    await expect.soft(await page.locator('ul > li > a[href="/open-positions"]').getAttribute('href')).toEqual("/open-positions");
    await expect.soft(await page.locator('ul > li > a[href="/about"]').getAttribute('href')).toEqual("/about")
});


test.describe('Screen639', () => {
    test.use({ viewport: { width: 639, height: 1130} });
    test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
});
    test('06', async ({ page }) => {
        await expect.soft(await page.getByAltText('Dr. Berg Logo').first().getAttribute('src')).toEqual('https://drberg-dam.imgix.net/dr-berg-images/logo-48-small.svg')
    });
});

test.describe('Screen640', () => {
    test.use({ viewport: { width: 639, height: 1130} });
    test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
});
    test('07', async ({ page }) => {
        await expect.soft(await page.getByAltText('Dr. Berg Logo').first().getAttribute('src')).toEqual('https://drberg-dam.imgix.net/dr-berg-images/logo-48-full.svg')
    });
});

test('08-09', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await page.getByRole('navigation').getByRole('button').nth(1).click();
    await expect.soft(page.locator('ul > li > a')).toContainText(['drberg.com', 'shop.drberg.com','courses.drberg.com']);
    await expect.soft(await page.locator('ul > li > a[href="https://drberg.com/?utm_source=careers.drberg.com&utm_medium=network-icon"]').getAttribute('href')).toEqual("https://drberg.com/?utm_source=careers.drberg.com&utm_medium=network-icon");
    await expect.soft(await page.locator('ul > li > a[href="https://shop.drberg.com/?utm_source=careers.drberg.com&utm_medium=network-icon"]').getAttribute('href')).toEqual("https://shop.drberg.com/?utm_source=careers.drberg.com&utm_medium=network-icon");
    await expect.soft(await page.locator('ul > li > a[href="https://courses.drberg.com/?utm_source=careers.drberg.com&utm_medium=network-icon"]').getAttribute('href')).toEqual("https://courses.drberg.com/?utm_source=careers.drberg.com&utm_medium=network-icon")
});

test('10', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(await page.getByAltText('Dr. Berg Logo').nth(1).getAttribute('srcset')).toEqual('https://drberg-dam.imgix.net/dr-berg-images/logo-48-full.svg');
    await expect.soft(await page.locator('.total a[href="/"]').getAttribute('href')).toEqual("/");
    await page.getByRole('contentinfo').getByRole('link', { name: 'Dr. Berg Logo' }).click();
    await expect(page).toHaveURL('./')
});

test('12', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(await page.locator('.flex > a').first().getAttribute('href')).toEqual('https://twitter.com/dr_ericberg');
    await expect.soft(await page.locator('.flex > a:nth-child(2)').first().getAttribute('href')).toEqual('https://www.facebook.com/drericberg');
    await expect.soft(await page.locator('a:nth-child(3)').first().getAttribute('href')).toEqual('https://www.youtube.com/c/DrEricBergDC');
    await expect.soft(await page.locator('a:nth-child(4)').first().getAttribute('href')).toEqual('https://www.pinterest.com/drericberg/');
    await expect.soft(await page.locator('a:nth-child(5)').first().getAttribute('href')).toEqual('https://www.instagram.com/drericberg');
});

test('13', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    const expectedTextRegex = /Dr\. Berg Nutritionals,[\s\S]*Address: 4501 Ford Avenue, Alexandria, VA 22302\.[\s\S]*Phone: 703-354-7336/;
    await expect(await page.locator('.address')).toHaveText(expectedTextRegex); 
    await expect(await page.locator('.total').getByText('© Copyright 2022. All rights reserved.')).toBeVisible()
});















