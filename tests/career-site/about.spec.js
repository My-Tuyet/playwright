import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState();
});

test('a03-04', async ({ page }) => {
    await expect.soft(page.locator('.__wedo__content__header')).toHaveText('What we do');
    await expect.soft(page.locator('.__wedo__content__container .__content__title').first()).toHaveText('Technology'); 
    await expect.soft(page.locator('.__wedo__content__container .__content__description').first()).toHaveText('We build tools and apps that make it simpler for people to start and sustain a healthy low-carb lifestyle. Our engineering team has massive challenges ahead, and it’s growing rapidly.'); 
    await expect.soft(page.locator('.__wedo__content__container .__content__title').nth(1)).toHaveText('Courses');
    await expect.soft(page.locator('.__wedo__content__container .__content__description').nth(1)).toHaveText('We create in-depth courses on health and wellness topics to empower users with knowledge. Our goal is to explain complex health topics in simple terms so they can become an expert in a field where there are so many conflicting opinions.'); 
    await expect.soft(page.locator('.__wedo__content__container .__content__title').nth(2)).toHaveText('Books and recipes');
    await expect.soft(page.locator('.__wedo__content__container .__content__description').nth(2)).toHaveText('We use books and ebooks to break down complex health topics into digestible information. We also provide cookbooks and recipes to help people stay on a healthy eating plan and improve their skills in the kitchen.'); 
    await expect.soft(page.locator('.__wedo__content__container .__content__title').nth(3)).toHaveText('Videos');
    await expect.soft(page.locator('.__wedo__content__container .__content__description').nth(3)).toHaveText('We have a growing YouTube channel of over 7 million subscribers and more than 1 billion views. Our channel provides free information to the world to educate and help people create a better lifestyle using the latest health and wellness strategies.'); 
    await expect.soft(page.locator('.__wedo__content__container .__content__title').nth(4)).toHaveText('Dietary supplements and beauty products');
    await expect.soft(page.locator('.__wedo__content__container .__content__description').nth(4)).toHaveText('We create natural dietary supplements and skin and hair care products using high-quality ingredients and a rigorous research and development process. It\'s our goal to supply our customers with premium products that really work.'); 
});

test('a05-07', async ({ page }) => {
    await expect.soft(page.locator('.__progress__container .__progress__title')).toHaveText('Our progress');
    await expect.soft(page.locator('.__progress__container .__progress__description')).toHaveText('Our passionate viewers and customers have submitted more than 5.5 thousand success stories and thousands of 5-star product reviews, with more stories and reviews submitted every day. It\'s clear that our company has made a substantial impact on the world with our quality health and wellness content and products, and we want to keep extending our reach. Contact us if you think you’d be a good fit for our team!');
    await expect.soft(page.locator('.__progress__banner .__banner__content').first()).toHaveText('3 Billion impressions');
    await expect.soft(page.locator('.__progress__banner .__banner__content').nth(1)).toHaveText('160 Million views');
    await expect.soft(page.locator('.__progress__banner .__banner__content').nth(2)).toHaveText('40 Million unique viewers');
    await expect.soft(page.locator('.__progress__banner .__banner__content').nth(3)).toHaveText('Data displayed per last 90 days. Changing instantly... Ok, it\'s already changed.');
});

test('a08', async ({ page }) => {
    await expect.soft(page.locator('.__progress__content__box .__content__box__title').first()).toHaveText('Vision');
    await expect.soft(page.locator('.__progress__content__box .__box__description').first()).toHaveText('Our vision is to see millions of people get healthy and add years to their healthspan. This is why we have a team of professionals working around the clock to provide you with powerful natural health products and valuable content. Our sales assistants and customer support are unmatched by any in the industry. We believe that every person\'s health matters-this is why we take pride in our global reach.');
    await expect.soft(page.locator('.__progress__content__box .__content__box__title').nth(1)).toHaveText('Mission');
    await expect.soft(page.locator('.__progress__content__box .__box__description').nth(1)).toHaveText('Our mission is to transform the current approach to health and wellness from one that focuses on treating symptoms to one that addresses the root cause. We believe that the only way to achieve full health potential is to support the body\'s natural health pathways. Many people don\'t know about the holistic approach to health and wellness-we want to spread the word with the world.');
    await expect.soft(page.locator('.__progress__content__box .__content__box__title').nth(2)).toHaveText('Values');
    await expect.soft(page.locator('.__progress__content__box .__box__description').nth(2)).toHaveText('Our core values are to remain loyal to our community by providing trustworthy, science-backed information and high-quality supplements for the betterment of your health.')
});

test('a09-11', async ({ page }) => {
    await expect.soft(page.locator('.__benefits_perk__header .__header__title')).toHaveText('Our Perks and Benefits');
    await expect.soft(page.locator('.__benefits_perk__header .__benefits_perk__description')).toHaveText('Here are a few ways we contribute back to our employees.');
    await expect.soft(page.locator('.__benefits_perk__container .__benefits_perk__title').first()).toHaveText('Professional development and training');
    await expect.soft(page.locator('.__benefits_perk__container .__benefits_perk__description').first()).toHaveText('We offer paid on-the-job training and encourage professional advancements and continued education. Joining our team is an excellent opportunity to learn more about e-commerce and working with a health influencer!');
    await expect.soft(page.locator('.__benefits_perk__container .__benefits_perk__title').nth(1)).toHaveText('A health-conscious team');
    await expect.soft(page.locator('.__benefits_perk__container .__benefits_perk__description').nth(1)).toHaveText('Our company lives and breathes health and wellness, and we want to make it easy for you to be your best self. We provide gym memberships to all employees so they can take full advantage of staying active, whether that\'s pumping iron at the weightlifting stations or taking a Zumba class! We also offer a 50% discount off all of Dr. Berg’s products.');
    await expect.soft(page.locator('.__benefits_perk__container .__benefits_perk__title').nth(2)).toHaveText('Work & Life Balance');
    await expect.soft(page.locator('.__benefits_perk__container .__benefits_perk__description').nth(2)).toHaveText('We work hard here- but we also work smart. We understand that personal or family challenges arise and life happens, so we do our best to accommodate that. Our goal is to help employees create balance by offering paid vacation and holidays, as well as paid personal days so you can take the time you need when you need it.')
});

test('a12', async ({ page }) => {
    await expect.soft(page.locator('.__kpi__container .__kpi__title')).toHaveText('OKR\'s and KPI\'s oriented company.');
    await expect.soft(page.locator('.__kpi__container .__kpi__text')).toHaveText('We make decisions, give raises, and reward our staff based on unbiased decision-making processes using your contribution to the company and other stats that are easy to track. We don\'t believe in using mind games or office politics to motivate growth in our company—our hard-working employees are recognized for their hard work.');
    await expect.soft(page.locator('.__newtalent__container .__newtalent__title')).toHaveText('Always on the look for new talents');
    await expect.soft(page.locator('.__newtalent__container .__newtalent__description    ')).toHaveText('You can also connect with us, even in case there is no job opening listed at the moment for your skills. Simply connect with us and tell us what department is of any interest for you.');
    await expect.soft(page.getByRole('button', { name: 'Open positions', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Open positions', exact: true }).click();
    await expect(page).toHaveURL('./open-positions')
});