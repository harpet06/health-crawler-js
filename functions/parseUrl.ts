const parse = require("url-parse");

export const relativeUrlGenerator = (url: string) => {
    let formattedUrl = parse(url);
    formattedUrl = `${formattedUrl.protocol}//${formattedUrl.hostname}`
    return formattedUrl;
}