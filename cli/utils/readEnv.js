const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

function resolveEnvPath(targetPath = ".env") {
  return path.resolve(process.cwd(), targetPath);
}

function readEnvFile(targetPath = ".env") {
  const envPath = resolveEnvPath(targetPath);

  if (!fs.existsSync(envPath)) {
    throw new Error(`No env file found at ${envPath}`);
  }

  const data = fs.readFileSync(envPath, "utf8");
  return dotenv.parse(data);
}

module.exports = {
  readEnvFile,
  resolveEnvPath,
};
