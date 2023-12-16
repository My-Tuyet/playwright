import {test, expect} from "@playwright/test";
//careersite/attributes.json
//careersite/jobs.json
test.describe('open positions', async () => {
    var attrs, jobs = null;
    let attributeNames = ['location', 'department', 'type'];
    test.beforeEach('Go to open position page', async ({page, request}) => {
        if(!attrs){
            let attrResponse = await request.get(`${process.env.BLOB_URL}/careersite/attributes.json`);
            await expect(attrResponse).toBeOK();
            attrs = await attrResponse.json();
        }
        if(!jobs){
            let jobResponse = await request.get(`${process.env.BLOB_URL}/careersite/jobs.json`);
            await expect(jobResponse).toBeOK();
            jobs = await jobResponse.json();
        }
        await page.goto(`${process.env.CAREER_URL}/open-positions`);
        await page.waitForLoadState();
    })
    test('TS1', async ({page}) => {
        await expect(page).toHaveTitle('Opportunities - Dr. Berg Careers');
        await expect(page).toHaveURL(`${process.env.CAREER_URL}/open-positions`);
    })
    test('have header and footer', async ({page}) => {
        await expect(page.locator('header')).toBeAttached();
        await expect(page.locator('header nav')).toBeVisible();
        await expect(page.locator('footer')).toBeAttached();
        await expect(page.locator('footer')).toBeVisible();
    })

    test('TS7', async ({page}) => {
        for(let i = 0; i < attributeNames.length; i++){
           await expect((await page.locator(`.longtext_title`).nth(i).innerHTML()).trim().toLowerCase()).toBe(attributeNames[i]);
        }
    })

    test('TS8', async ({page}) => {
        for(let i = 0; i < attributeNames.length; i++){
            let keyName = attributeNames[i] + 's';
            await page.locator(`.label-${attributeNames[i]}`).first().click();
            for(let j = 0; j < attrs[keyName].length; j++){
                let ele = await page.locator(`.dropdown-list-${attributeNames[i]} li:nth-child(${j+1}) input`);
                await expect(await ele.isChecked()).toBeFalsy();
            }
         }
    })

    test('TS9', async ({page}) => {
        for(let key of Object.keys(attrs)){
            let keyName = key.slice(0, -1);
            let keyEle = (await page.$$(`.label-${keyName}`))[0];
            await expect((await keyEle.innerText()).toLowerCase()).toBe(keyName);
            await keyEle.click();
            for(let i = 0; i < attrs[key].length; i++){
                let ele = await page.locator(`.dropdown-list-${keyName} li:nth-child(${i+1})`);
                await expect(await (await ele.locator(`.label-filter`)).innerText()).toBe(attrs[key][i].name);
                await expect(+(await (await ele.locator(`input`)).inputValue())).toBe(attrs[key][i].id);
            }
        }
    })

    test('TS10', async ({page}) => {
        for(let key of Object.keys(attrs)){
            let keyName = key.slice(0, -1);
            let keyEle = (await page.$$(`.label-${keyName}`))[0];
            await expect((await keyEle.innerText()).toLowerCase()).toBe(keyName);
            await keyEle.click();
            for(let i = 0; i < attrs[key].length; i++){
                let ele = await page.locator(`.dropdown-list-${keyName} li:nth-child(${i+1})`);
                await ele.locator(`.check`).click();
                let jobAfterFilter =await Promise.all(
                    (await page.$$('.job-listing-component a')).map(async c => await c.getAttribute('href'))
                ) 
                if(!jobAfterFilter?.length){
                    await expect(page.getByText('There is no job available for the applied filters. Please choose other filter options.')).toBeVisible();
                }else {
                    await expect(jobAfterFilter).toEqual(jobs.filter(c => c[`${keyName}Id`] == attrs[key][i].id).map(c => `/open-positions/${c.slug}`));
                }
                await ele.locator(`.check`).click();
            }
        }
    })

    test('TS11', async ({page}) => {
        for(let i = 0; i < jobs.length; i++){
            expect(await page.locator(`.job-listing-component a:nth-child(${i+1}) .__content__left__title`).innerText()).toEqual(jobs[i].title.trim());
            expect(await page.locator(`.job-listing-component a:nth-child(${i+1}) .__content__left__position`).innerText()).toEqual(jobs[i].summary.trim());
        }
    })

    test('TS12', async ({page}) => {
        let jobElems = await page.$$('.job-listing-component > a');
        for(let i = 0; i < jobElems?.length; i++){
            let ele = page.locator(`.job-listing-component a:nth-child(${i+1})`);
            await ele.click({position: { x: 23, y: 32 }});
            await page.waitForLoadState();
            await expect(page).toHaveURL(`${process.env.CAREER_URL}/open-positions/${jobs[i].slug}`);
            await page.goBack();
            await page.waitForLoadState();
        }
    })

    test('TS13', async ({page}) => {
        let DDLAttribute = ['Location', 'Department', 'Type'];
        if(!jobs.length) {
            for(let i = 0; i < attributeNames.length; i++){
                await expect(await page.locator(`.dropdown .dropdown-${DDLAttribute[i]}`)).toBeHidden();
            }
        }
    })

    test('TS14', async ({page}) => {
        if(!jobs.length) {
            await expect(await page.getByText('No open positions right now but you can always contact us for any position you are interested in.')).toBeVisible();
        }
    })


    test('TS15', async ({page}) => {
        if(!jobs.length) {
            await page.getByText('Contact us', {exact: true}).click();
            await page.waitForLoadState();
            await expect(page).toHaveURL(`${process.env.CAREER_URL}/contact-us`);
        }
    })

    // test('job attribute', async ({page}) => {
    //     for(let key of Object.keys(attrs)){
    //         let keyName = key.slice(0, -1);
    //         let keyEle = (await page.$$(`.label-${keyName}`))[0];
    //         await expect((await keyEle.innerText()).toLowerCase()).toBe(keyName);
    //         await keyEle.click();
    //         for(let i = 0; i < attrs[key].length; i++){
    //             let ele = await page.locator(`.dropdown-list-${keyName} li:nth-child(${i+1})`);
    //             await expect(await (await ele.locator(`.label-filter`)).innerText()).toBe(attrs[key][i].name);
    //             await expect(+(await (await ele.locator(`input`)).inputValue())).toBe(attrs[key][i].id);
    //             await ele.locator(`.check`).click();
    //             let jobAfterFilter =await Promise.all(
    //                 (await page.$$('.job-listing-component a')).map(async c => await c.getAttribute('href'))
    //             ) 
    //             await expect(jobAfterFilter).toEqual(jobs.filter(c => c[`${keyName}Id`] == attrs[key][i].id).map(c => `/open-positions/${c.slug}`));
    //             await ele.locator(`.check`).click();
    //         }
    //     }

    //     let jobElems = await page.$$('.job-listing-component > a');
    //     await expect(jobs?.length).toEqual(jobElems?.length);
    //     for(let i = 0; i < jobElems?.length; i++){
    //         let ele = page.locator(`.job-listing-component a:nth-child(${i+1})`);
    //         await expect((await ele.locator(`h3`).innerText()).trim()).toEqual(jobs[i].title?.trim())
    //         await expect((await ele.locator(`.__content__left__position`).innerText()).trim()).toEqual(jobs[i].summary?.trim())
    //         await ele.click({position: { x: 23, y: 32 }});
    //         await page.waitForLoadState();
    //         await expect(page).toHaveURL(`${process.env.CAREER_URL}/open-positions/${jobs[i].slug}`);
    //         await page.goBack();
    //         await page.waitForLoadState();
    //     }
    // })
})

test.describe('open positions with screen < 640px', async () => {
    test.use({viewport: {width: 639, height: 700}});
    var attrs, jobs = null;
    let attributeNames = ['location', 'department', 'type'];
    test.beforeEach('Go to open position page', async ({page, request}) => {
        if(!attrs){
            let attrResponse = await request.get(`${process.env.BLOB_URL}/careersite/attributes.json`);
            await expect(attrResponse).toBeOK();
            attrs = await attrResponse.json();
        }
        if(!jobs){
            let jobResponse = await request.get(`${process.env.BLOB_URL}/careersite/jobs.json`);
            await expect(jobResponse).toBeOK();
            jobs = await jobResponse.json();
        }
        await page.goto(`${process.env.CAREER_URL}/open-positions`);
        await page.waitForLoadState();
    })
    test('TS2', async ({page}) => {
        await page.locator('#filters').click();
        await expect(await page.locator('.popup-filter')).toBeVisible();
    })

    test('TS3', async ({page}) => {
        await page.locator('#filters').click();
        for(let i = 0; i < attributeNames.length; i++){
            let key = attributeNames[i] + 's';
            await expect((await page.locator(`.list-menu.${attributeNames[i]} > .title`).innerText()).trim().toLowerCase()).toBe(attributeNames[i]);
            for(let j = 0; j < attrs[key].length; j++){
                let ele = await page.locator(`.list-menu.${attributeNames[i]} li:nth-child(${j+1})`);
                await expect(await (await ele.locator(`.label-filter`)).innerText()).toBe(attrs[key][j].name);
                await expect(+(await (await ele.locator(`input`)).inputValue())).toBe(attrs[key][j].id);
            }
        }
    })
    
    test('TS4', async ({page}) => {
        await page.locator('#filters').click();
        await page.getByRole('main').getByRole('img', { name: 'Close' }).click();
        await expect(await page.locator('.popup-filter')).toBeHidden();
    })

    test('TS5', async ({page}) => {
        await page.locator('#filters').click();
        for(let key of Object.keys(attrs)){
            let keyName = key.slice(0, -1);
            for(let i = 0; i < attrs[key].length; i++){
                let ele = await page.locator(`.list-menu.${keyName} li:nth-child(${i+1})`);
                await ele.locator(`.check`).click();
                await page.getByText('Apply', {exact: true}).click();
                let jobAfterFilter =await Promise.all(
                    (await page.$$('.job-listing-component a')).map(async c => await c.getAttribute('href'))
                ) 
                if(!jobAfterFilter?.length){
                    await expect(page.getByText('There is no job available for the applied filters. Please choose other filter options.')).toBeVisible();
                }else {
                    await expect(jobAfterFilter).toEqual(jobs.filter(c => c[`${keyName}Id`] == attrs[key][i].id).map(c => `/open-positions/${c.slug}`));
                }
                await page.locator('#filters').click();
                await ele.locator(`.check`).click();
            }
        }
    })
    
    test('TS6', async ({page}) => {
        await page.locator('#filters').click();
        for(let key of Object.keys(attrs)){
            let keyName = key.slice(0, -1);
            for(let i = 0; i < attrs[key].length; i++){
                await page.locator(`.list-menu.${keyName} li:nth-child(${i+1}) .check`).click();
            }
        }
        await page.getByRole('button', {name: 'Clear all filters', exact: true}).click();
        for(let key of Object.keys(attrs)){
            let keyName = key.slice(0, -1);
            for(let i = 0; i < attrs[key].length; i++){
                await expect(await page.locator(`.list-menu.${keyName} li:nth-child(${i+1}) input`).isChecked()).toBeFalsy();
            }
        }
    })
})

