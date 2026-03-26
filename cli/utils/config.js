const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(require("os").homedir(), ".envsync");

function saveToken(token) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ token }));
}

function getToken() {
  if (!fs.existsSync(CONFIG_PATH)) return null;

  const data = JSON.parse(fs.readFileSync(CONFIG_PATH));
  return data.token;
}

module.exports = { saveToken, getToken };