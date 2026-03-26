const fs = require("fs");

function writeEnvFile(secrets) {
  let content = "";

  for (let key in secrets) {
    content += `${key}=${secrets[key]}\n`;
  }

  fs.writeFileSync(".env", content);
}

module.exports = writeEnvFile;