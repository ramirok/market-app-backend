const config = require("../utils/config");
const fetch = require("node-fetch");

const basicAuth = Buffer.from(
  `${config.PAYPAL_CLIENT_ID}:${config.PAYPAL_SECRET}`,
  "utf-8"
).toString("base64");

const getAccessToken = async () => {
  // fetches auth access token
  const auth = await fetch("https://api.sandbox.paypal.com/v1/oauth2/token/", {
    method: "POST",
    headers: {
      Accept: `application/json`,
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials`,
  });
  const parsedAuth = await auth.json();
  return parsedAuth.access_token;
};

module.exports = { getAccessToken };
