import { test, expect } from '@playwright/test';

test('hp01-02', async ({ page }) => {
await page.goto('/');
await page.waitForLoadState();
await expect.soft(page.getByText('Join Our Team').first()).toBeVisible();
await expect.soft(page.getByText('Join us to transform the current approach to health and wellness from one that focuses on treating symptoms to one that addresses the root cause.').first()).toBeVisible();
});

test('hp03-04', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState();
  await expect.soft(page.getByRole('button', { name: 'View open positions' })).toBeVisible();
  await page.getByRole('button', { name: 'View open positions' }).click();
  await expect(page).toHaveURL('./open-positions')
});

test('hp05', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState();
  let srcset = await page.getByAltText('Dr. Berg careers').getAttribute('srcset');
  let src = srcset.split(', ');
  console.log(src)
  await expect.soft(src.some(c =>!c.startsWith('https://drberg-dam.imgix.net/others/careers-homepage-backgound.jpg'))).toBe(false);
});
//split: cắt chuỗi , some: truyền vào function 

test('hp06', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState();
  await expect(page.getByText('Open Positions').first()).toBeVisible();
});

test('hp07', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState();
  await expect.soft(page.getByRole('link', { name: 'View all positions' })).toBeVisible();
  await page.getByRole('link', { name: 'View all positions' }).click();
  await expect(page).toHaveURL('./open-positions')
});

test('hp08-09', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState();
  await expect.soft(page.getByText('Our Benefit & perks').first()).toBeVisible();
  await expect.soft(page.getByText('Here are a few ways we contribute back to our employees.').first()).toBeVisible();
});


// test('hp10-11b', async ({ page,request }) => {
//   let response = await request.get('https://drbergstorage.blob.core.windows.net/careersite/jobs.json');
//   let data = await response.json();
//   console.log(data);
//   await page.goto('/');
//   await page.waitForLoadState();
//   let jobTitleElement = await page.locator('.__content__left__title').first();
//   let jobTitleText = await jobTitleElement.textContent();
//   // console.log(jobTitleText)
//   let jobpositionElement = await page.locator('.__content__left__position').first();
//   let jobpositionText = await jobpositionElement.textContent();
//   console.log(jobpositionText)
// }); 


test('hp10-11a', async ({page, request}) => {
  let apiRes = await request.get(`${process.env.BLOB_URL}/careersite/jobs.json`);
  await expect(apiRes).toBeOK();
  let apiData = await apiRes.json();
  await page.goto(process.env.CAREER_URL);
  await page.waitForLoadState();
  for(let job of apiData) {
      let hrefElem = await page.locator(`[href="/open-positions/${job.slug}"]`);
      await expect((await hrefElem.locator('.__content__left__title').innerText()).trim()).toBe(job.title.trim());
      await expect((await hrefElem.locator('.__content__left__position').innerText()).trim()).toBe(job.summary.trim());
  }
})


test('hp10-11', async ({page, request}) => {
  let apiRes = await request.get('https://drbergstorage.blob.core.windows.net/careersite/jobs.json');
  await expect(apiRes).toBeOK();
  let apiData = await apiRes.json();
  await page.goto('/');
  await page.waitForLoadState();
  for(let job of apiData) {
      let hrefElem = await page.locator(`[href="/open-positions/${job.slug}"]`);
      console.log(hrefElem);
      await expect((await hrefElem.locator('.__content__left__title').innerText()).trim()).toBe(job.title.trim());
      await expect((await hrefElem.locator('.__content__left__position').innerText()).trim()).toBe(job.summary.trim());
  }
})

test('hp12-13', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState();
  await expect.soft(page.locator('id=benefits_perk').getByText('Our Benefit & perks').first()).toBeVisible();
  await expect.soft(page.locator('id=benefits_perk').getByText('Here are a few ways we contribute back to our employees.').first()).toBeVisible();});

test('hp15-17', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(page.locator('.__benefits_perk__box').getByText('Work & Life Balance')).toBeVisible();
    await expect.soft(page.locator('.__benefits_perk__box').getByText('We work hard here- but we also work smart. We understand that personal or family challenges arise and life happens, so we do our best to accommodate that. Our goal is to help employees create balance by offering paid vacation and holidays, as well as paid personal days so you can take the time you need when you need it.')).toBeVisible();
    await expect.soft(page.locator('.__benefits_perk__box').getByText('A health-conscious team')).toBeVisible();
    await expect.soft(page.locator('.__benefits_perk__box').getByText('Our company lives and breathes health and wellness, and we want to make it easy for you to be your best self. We provide gym memberships to all employees so they can take full advantage of staying active, whether that\'s pumping iron at the weightlifting stations or taking a Zumba class! We also offer a 50% discount off all of Dr. Berg’s products.')).toBeVisible();
    await expect.soft(page.locator('.__benefits_perk__box').getByText('Professional development and training')).toBeVisible();
    await expect.soft(page.locator('.__benefits_perk__box').getByText('We offer paid on-the-job training and encourage professional advancements and continued education. Joining our team is an excellent opportunity to learn more about e-commerce and working with a health influencer!')).toBeVisible();
    });

test('hp18-20', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(page.getByText('Equal Opportunity Employer').first()).toBeVisible();
    await expect.soft(page.getByText('Dr. Berg Nutritionals is proud to be an equal opportunity employer that values equality and diversity. We do not discriminate based on gender, race, ethnicity, national origin, age, disability, religion, sexual orientation, gender identity or expression, veteran status, or any other applicable characteristics protected by law.')).toBeVisible();
    let srcset = await page.locator('.__info_image__container').getByAltText('puzzle pieces of employee avatars').getAttribute('srcset');
    let src = srcset.split(', ');
    console.log(src)
    await expect.soft(src.some(c =>!c.startsWith('https://drberg-dam.imgix.net/others/career-equal-opportunity-employer.png'))).toBe(false);
    });

test('hp21-23', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(page.getByText('Remotely powered global team').first()).toBeVisible();
    await expect.soft(page.getByText('Allowing people to work from home or from anywhere is something we believe strongly in. You will have the freedom to work from wherever you are and spend time where you feel comfortable.')).toBeVisible();
    let srcset = await page.locator('.__info_image__container').getByAltText('the boy and the woman with a laptop').getAttribute('srcset');
    let src = srcset.split(', ');
    await expect.soft(src.some(c =>!c.startsWith('https://drberg-dam.imgix.net/others/career-remotely-powered.png'))).toBe(false);
});

test('hp24-25', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(page.getByText('Our mission is to transform the current approach to health and wellness from one that focuses on treating symptoms to one that addresses the root cause. We believe that the only way to achieve full health potential is to support the body’s natural health pathways. Many people don’t know about the holistic approach to health and wellness—we want to spread the word with the world.')).toBeVisible();
    await expect.soft(await page.getByAltText('Green background').getAttribute('src')).toEqual('https://drberg-dam.imgix.net/others/green-background-with-dashed-borders.jpg')
});

test('hp26', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(page.locator('.__whatwedo__container').getByText('What we do')).toBeVisible();
});

test('hp27', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(page.locator('.__whatwedo__body').getByText('Dietary supplements',{ exact: true })).toBeVisible();
    await expect.soft(page.locator('.__whatwedo__body').getByText('We create premium dietary supplements to provide in a simple form and easy to use all the nutrients your body needs.')).toBeVisible();
    await page.waitForTimeout(5000)
    await expect.soft(page.locator('.__whatwedo__body').getByText('We create premium dietary supplements to provide in a simple form and easy to use all the nutrients your body needs.')).toBeHidden();
});

test('hp28-34', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await page.getByText('Dietary supplements', { exact: true }).click();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We create premium dietary supplements to provide in a simple form and easy to use all the nutrients your body needs.')).toBeVisible();
    let srcset = await page.locator('.__whatwedo__body').getByRole('img', { name: 'Dr. Berg supplements' }).getAttribute('srcset');
    // let srcset = await page.locator('.__whatwedo__body').getByAltText('Dr. Berg supplements').getAttribute('srcset');
    let src = srcset.split(', ');
    await expect.soft(src.some(c =>!c.startsWith('https://drberg-dam.imgix.net/others/dr-berg-dietary-supplements.png'))).toBe(false);
    
    await page.waitForTimeout(5000)
    await expect.soft(page.locator('.__whatwedo__box-title').getByText('Videos')).toBeVisible();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We create low-carb related video courses, cooking shows, short documentaries, interview videos, high-quality presentations and more.')).toBeVisible();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We create premium dietary supplements to provide in a simple form and easy to use all the nutrients your body needs.')).toBeHidden();
    let srcset2 = await page.locator('.__whatwedo__body').getByRole('img', { name: 'Dr. Berg YouTube videos' }).getAttribute('srcset');
    let src2 = srcset2.split(', ');
    await expect.soft(src2.some(c =>!c.startsWith('https://drberg-dam.imgix.net/others/dr-berg-videos.png'))).toBe(false);

    await page.waitForTimeout(5000)
    await expect.soft(page.locator('.__whatwedo__box-title').getByText('Courses')).toBeVisible();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We create courses on different health topics …… to empower user with knowledge explaining in simple words complicated health issues.')).toBeVisible();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We create low-carb related video courses, cooking shows, short documentaries, interview videos, high-quality presentations and more.')).toBeHidden();
    let srcset3 = await page.locator('.__whatwedo__body').getByRole('img', { name: 'Notebook and mobile' }).getAttribute('srcset');
    let src3 = srcset3.split(', ');
    await expect.soft(src3.some(c =>!c.startsWith('https://drberg-dam.imgix.net/others/dr-berg-courses.png'))).toBe(false);

    await page.waitForTimeout(5000)
    await expect.soft(page.locator('.__whatwedo__box-title').getByText('Food recipes')).toBeVisible();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We create amazing low-carb recipes, meal plans and cooking videos. Our site offers more than 1000 free recipes, empowering people to eat delicious food while improving their health.')).toBeVisible();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We create courses on different health topics …… to empower user with knowledge explaining in simple words complicated health issues.')).toBeHidden();
    let srcset4 = await page.locator('.__whatwedo__body').getByRole('img', { name: 'Salmon salad' }).getAttribute('srcset');
    let src4 = srcset4.split(', ');
    await expect.soft(src4.some(c =>!c.startsWith('https://drberg-dam.imgix.net/others/dr-berg-healthy-recipes.jpg'))).toBe(false);

    await page.waitForTimeout(5000)
    await expect.soft(page.locator('.__whatwedo__box-title').getByText('Technology')).toBeVisible();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We build tools and apps that make it simpler for people to start and sustain a healthy low-carb lifestyle. Our engineering team has massive challenges ahead, and it’s growing rapidly.')).toBeVisible();
    await expect.soft(page.locator('.active.__whatwedo__box-description').getByText('We create amazing low-carb recipes, meal plans and cooking videos. Our site offers more than 1000 free recipes, empowering people to eat delicious food while improving their health.')).toBeHidden();
    let srcset5 = await page.locator('.__whatwedo__body').getByRole('img', { name: 'Dr. Berg mobile application' }).getAttribute('srcset');
    let src5 = srcset5.split(', ');
    await expect.soft(src5.some(c =>!c.startsWith('https://drberg-dam.imgix.net/others/dr-berg-applications.png'))).toBe(false);
});


test('hp35-40', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState();
    await expect.soft(page.getByText('Always on the look for new talents').first()).toBeVisible();
    await expect.soft(page.getByText('You can also connect with us, even in case there is no job opening listed at the moment for your skills. Simply connect with us and tell us what department is of any interest for you.')).toBeVisible();
    await expect.soft(page.getByRole('button', { name: 'Open positions', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Open positions', exact: true }).click();
    await expect(page).toHaveURL('./open-positions')
});


