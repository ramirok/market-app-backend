const queryString = require("querystring");
const config = require("./config");
const fetch = require("node-fetch");

// generates url for google login
const stringifiedParams = queryString.stringify({
  client_id: config.GOOGLE_CLIENT_ID,
  redirect_uri: "http://localhost:3000/auth/google",
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" "), // space seperated string
  response_type: "code",
  access_type: "offline",
  prompt: "consent",
});

// recives code query from redirect url and fetch google api to get access token
const getAccessTokenFromCode = async (code) => {
  const response = await fetch(`https://oauth2.googleapis.com/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: config.GOOGLE_CLIENT_ID,
      client_secret: config.GOOGLE_SECRET,
      redirect_uri: "http://localhost:3000/auth/google",
      grant_type: "authorization_code",
      code,
    }),
  });
  const parsedResponse = await response.json(); // { access_token, expires_in, token_type, refresh_token }
  return parsedResponse;
};

// recived access token and fetch google api to get user details
const getUserDetails = async (access_token) => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const parsedResponse = await response.json(); // { id, email, given_name, family_name }
  return parsedResponse;
};

module.exports = { getAccessTokenFromCode, getUserDetails, stringifiedParams };
