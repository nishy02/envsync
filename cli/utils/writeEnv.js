const fs = require("fs");
const path = require("path");

function resolveEnvPath(targetPath = ".env") {
  return path.resolve(process.cwd(), targetPath);
}

function formatValue(value) {
  const text = value == null ? "" : String(value);

  if (text === "") {
    return '""';
  }

  if (/[\s#"'`]/.test(text)) {
    return JSON.stringify(text);
  }

  return text;
}

function writeEnvFile(secrets, targetPath = ".env") {
  const envPath = resolveEnvPath(targetPath);
  const lines = Object.entries(secrets).map(([key, value]) => `${key}=${formatValue(value)}`);

  fs.writeFileSync(envPath, `${lines.join("\n")}\n`, "utf8");
  return envPath;
}

module.exports = {
  writeEnvFile,
  resolveEnvPath,
};
