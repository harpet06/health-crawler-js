const parse = require("url-parse");

export const relativeUrlGenerator = (url) => {
    let formattedUrl = parse(url);
    formattedUrl = `${formattedUrl.protocol}//${formattedUrl.hostname}`
    return formattedUrl;
}