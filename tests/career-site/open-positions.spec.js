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
        await expect(page.locator('header nav')).toBeVisible();
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
                let ele = await page.locator(`.dropdown-list-${keyName} li:nth-child(${i+1})`);
                await expect(await (await ele.locator(`.label-filter`)).innerText()).toBe(attrs[key][i].name);
                await expect(+(await (await ele.locator(`input`)).inputValue())).toBe(attrs[key][i].id);
                await ele.locator(`.check`).click();
                let jobAfterFilter =await Promise.all(
                    (await page.$$('.job-listing-component a')).map(async c => await c.getAttribute('href'))
                ) 
                await expect(jobAfterFilter).toEqual(jobs.filter(c => c[`${keyName}Id`] == attrs[key][i].id).map(c => `/open-positions/${c.slug}`));
                await ele.locator(`.check`).click();
            }
        }

        let jobElems = await page.$$('.job-listing-component > a');
        await expect(jobs?.length).toEqual(jobElems?.length);
        for(let i = 0; i < jobElems?.length; i++){
            let ele = page.locator(`.job-listing-component a:nth-child(${i+1})`);
            await expect((await ele.locator(`h3`).innerText()).trim()).toEqual(jobs[i].title?.trim())
            await expect((await ele.locator(`.__content__left__position`).innerText()).trim()).toEqual(jobs[i].summary?.trim())
            await ele.click({position: { x: 23, y: 32 }});
            await page.waitForLoadState();
            await expect(page).toHaveURL(`${process.env.CAREER_URL}/open-positions/${jobs[i].slug}`);
            await page.goBack();
            await page.waitForLoadState();
        }
    })
})

