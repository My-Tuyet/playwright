import {test, expect} from "@playwright/test";
//careersite/attributes.json
//careersite/jobs.json
test.describe('open positions', () => {
    test.beforeEach('Go to open position page', async ({page}) => {
        await page.goto(`${process.env.CAREER_URL}/open-positions`);
        await page.waitForLoadState();
    })
    test('access page', async ({page}) => {
        await expect(page).toHaveTitle('Opportunities - Dr. Berg Careers');
        await expect(page).toHaveURL(`${process.env.CAREER_URL}/open-positions`);
    })
    test('have header and footer', async ({page}) => {
        await expect(page.locator('header')).toBeAttached();
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('footer')).toBeAttached();
        await expect(page.locator('footer')).toBeVisible();
    })
    test('job attribute', async ({page, request}) => {
        let attrResponse = await request.get(`${process.env.BLOB_URL}/careersite/attributes.json`);
        let jobResponse = await request.get(`${process.env.BLOB_URL}/careersite/jobs.json`);
        await expect(attrResponse).toBeOK();
        await expect(jobResponse).toBeOK();
        let attrs = await attrResponse.json();
        let jobs = await jobResponse.json(); 

        await page.goto(`${process.env.CAREER_URL}/open-positions`);
        await page.waitForLoadState();
        
        for(let key of Object.keys(attrs)){
            let keyName = key.slice(0, -1);
            let keyEle = (await page.$$(`.label-${keyName}`))[0];
            await expect((await keyEle.innerText()).toLowerCase()).toBe(keyName);
            await keyEle.click();
            for(let i = 0; i < attrs[key].length; i++){
                await expect(await (await page.$$(`.dropdown-list-${keyName} li:nth-child(${i+1}) .label-filter`))[0].innerText()).toBe(attrs[key][i].name);
                await expect(+(await (await page.$$(`.dropdown-list-${keyName} li:nth-child(${i+1}) input`))[0].inputValue())).toBe(attrs[key][i].id);
            }
        }

    })
})

