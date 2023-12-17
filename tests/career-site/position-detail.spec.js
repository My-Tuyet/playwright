import { test, expect } from "@playwright/test";
test.describe("position detail", async () => {
  var jobs = null;
  let url = "";
  test.beforeEach("Go to open position page", async ({ request }) => {
    if (!jobs) {
      let jobResponse = await request.get(
        `${process.env.BLOB_URL}/careersite/jobs.json`
      );
      await expect.soft(jobResponse).toBeOK();
      jobs = await jobResponse.json();
      url = `./open-positions/${jobs[0].slug}`;
    }
  });

  test("TS01", async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState();
    await page.getByRole("main").getByRole("link").first().click();
    await expect.soft(page).toHaveURL("./open-positions");
  });

  test("d02", async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState();
    await page.getByRole("link", { name: "Back to job listings" }).click();
    await expect.soft(page).toHaveURL("./open-positions");
  });

  test("d03", async ({ page }) => {
    for (let i = 0; i < jobs.length; i++) {
      await page.goto(`./open-positions/${jobs[i].slug}`);
      await page.waitForLoadState();
      await expect.soft(await page.locator(".list-type").innerText()).toEqual(
        jobs[i].summary
      );
      await expect.soft(await page.locator(".title").innerText()).toEqual(
        jobs[i].title.trim()
      );
      await expect.soft(
        (await page.locator("#detail-job").innerHTML()).trim()
      ).toEqual(jobs[i].description.trim());
      await page
        .getByRole("button", { name: "Join our team", exact: true })
        .first()
        .click();
      await page.waitForLoadState();
      await expect.soft(page).toHaveURL(`${process.env.CAREER_URL}/contact`);
      await page.goBack();
      await page.waitForLoadState();
      await page.locator(".btn-down-arrow img").click();
      await page.waitForTimeout(500);
      let isScrollTrue = await page.evaluate(() => {
        let height = window.screen.height;
        let isScrollDown = window.outerHeight - height < height;
        var body = document.body,
          html = document.documentElement;

        var heightPage = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        if (isScrollDown) return window.scrollY == heightPage - height;
        else return window.scrollY == height;
      });
      await expect.soft(isScrollTrue).toBeTruthy();
      await page
        .getByRole("button", { name: "Join our team", exact: true })
        .nth(1)
        .click();
      await page.waitForLoadState();
      await expect.soft(page).toHaveURL(`${process.env.CAREER_URL}/contact`);
    }
  });
});
