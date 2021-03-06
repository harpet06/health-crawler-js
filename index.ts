import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import middy from "middy";
import {
  cors,
  doNotWaitForEmptyEventLoop,
  httpHeaderNormalizer,
  httpErrorHandler
} from "middy/middlewares";
import { crawl } from "./functions/crawl";
import { getLinks } from "./functions/links";
import { ResponseGen } from "./wrappers/response";

const handler = async (event: any) => {
  const executablePath = event.isOffline
    ? "./node_modules/puppeteer/.local-chromium/mac-674921/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
    : await chromium.executablePath;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath
  });

  let baseUrl: string = "https://www.bbc.co.uk/sport";
  let urls: Array<string> = [];
  let crawled: Array<object> = [];

  const page = await browser.newPage();
  await page.goto(baseUrl);

  await getLinks(page, urls, baseUrl);
  await crawl(urls, page, crawled);
  
  await browser.close();
  return new ResponseGen(200, crawled).generateResponse();
};

export const generate = middy(handler)
  .use(httpHeaderNormalizer())
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
 