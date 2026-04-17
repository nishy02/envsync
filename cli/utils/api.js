const axios = require("axios");
const { readConfig } = require("./config");

function createApiClient() {
  const config = readConfig();
  const token = config.token;

  return axios.create({
    baseURL: config.apiBaseUrl,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}

module.exports = { createApiClient };
