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
  let crawled: Array<string> = [];

  const page = await browser.newPage();
  await page.goto(baseUrl);

  await getLinks(page, urls, baseUrl);
  await crawl(urls, page, crawled);
  
  const sendMessageToClient = (url, connectionId, payload) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: url,
    });
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log('err is', err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
  
  
  
  
  
  
  
  
  await browser.close();





  return new ResponseGen(200, crawled).generateResponse();
};

export const generate = middy(handler)
  .use(httpHeaderNormalizer())
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
