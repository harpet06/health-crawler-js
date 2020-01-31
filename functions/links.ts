import cheerio from "cheerio";

export const getLinks = async (page: any, links: Array<string>) => {
  const pageBody = await page.content();
  const $ = cheerio.load(pageBody);
  const relativeLinks = $("a[href^='/']");
  relativeLinks.each(function() {
    links.push($(relativeLinks).attr("href"));
  });
  console.log(JSON.stringify(links))
};
