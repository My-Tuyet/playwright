import {test, expect} from "@playwright/test"
test.use({
    viewport: {
        width: 430,
        height: 932 // Iphone 14 pro max
    }
})
test('position', async ({page}) => {
    await page.goto('/services');
    await page.waitForLoadState();
    // await page.screenshot({path: 'tests/ui/services.spec.js-snapshots/iphone14.png'});
    // expect(await page.screenshot()).toMatchSnapshot('services', 'iphone11.png');
    const result = await page.evaluate(async () => {
        let image = document.querySelector('.service_hero-image');
        let content = document.querySelector('.service_hero-title')
        return image.offsetTop - content.offsetTop;
    })
    expect(result>0).toBeTruthy();
})