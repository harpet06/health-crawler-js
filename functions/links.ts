import cheerio from "cheerio";

export const getLinks = async (
  page: any,
  links: Array<string>,
  baseUrl: string
) => {
  const pageBody = await page.content();
  const $ = cheerio.load(pageBody);
  const relativeLinks = $("a[href^='/']");
  relativeLinks.each(function(this: CheerioElement) {
    links.indexOf($(this).attr("href")!) === -1
      ? links.push(baseUrl + $(this).attr("href")!)
      : null;
  });
};
