export class ResponseGen {
  code: number;
  result: Array<string>;
  constructor(responseCode: number, results: Array<string>) {
    this.code = responseCode;
    this.result = results;
  }

  generateResponse() {
    return {
      statusCode: this.code,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(this.result),
      isBase64Encoded: false
    };
  }
}


