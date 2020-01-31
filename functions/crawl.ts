export const crawl = async (
  links: Array<string>,
  page: any,
  crawled: Array<string>
) => {
  for (let link of links) {
    await page.goto(link);
    crawled.push(page.url());
  }
};
