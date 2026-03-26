const fs = require("fs");

function readEnvFile() {
  const data = fs.readFileSync(".env", "utf-8");

  const lines = data.split("\n");
  const result = {};

  lines.forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  });

  return result;
}

module.exports = readEnvFile;