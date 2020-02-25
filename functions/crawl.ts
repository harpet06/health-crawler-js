import { health } from "./health";

let numberOfPagesVisited: number = 0
let maximumPagesToVisit: number = 3

export const crawl = async (
  urls: Array<string>,
  page: any,
  crawled: Array<string>
) => {
  for (let url of urls) {
    if (numberOfPagesVisited < maximumPagesToVisit) {
    const pageStatusCode = await health(page, url);
    console.log([pageStatusCode, url])
    crawled.push(url);
    numberOfPagesVisited++;
    } else return 
  }
};
