import { relativeUrlGenerator } from "./parseUrl";

export const health = async (page: any, url: string) => {
  const urlToVisit = relativeUrlGenerator(url);
  const response = await page.goto(urlToVisit);
  return response.status();
};
