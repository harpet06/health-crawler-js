import { health } from "./health";

let numberOfPagesVisited: number = 0;
let maximumPagesToVisit: number = 3;

export const crawl = async (
  urls: Array<string>,
  page: any,
  crawled: Array<object>
) => {
  for (let url of urls) {
    if (numberOfPagesVisited < maximumPagesToVisit) {
      const pageStatusCode = await health(page, url);
      crawled.push({ page: url, status: pageStatusCode });
      numberOfPagesVisited++;
    } else return;
  }
};
