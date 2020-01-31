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

const handler = async (event: any) => {
  const executablePath = event.isOffline
    ? "./node_modules/puppeteer/.local-chromium/mac-674921/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
    : await chromium.executablePath;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath
  });

  let urls = [];

  const page = await browser.newPage();
  await page.goto("https://www.bbc.co.uk/sport");

  await getLinks(page, urls);

  //await crawl(links, page, urls);
  await browser.close();

  return {
    statusCode: 200,
    headers: { "content-type": "text/html" },
    body: `<html><body>${JSON.stringify(urls)}</body></html>`
  };
};

export const generate = middy(handler)
  .use(httpHeaderNormalizer())
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
