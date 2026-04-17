const fs = require("fs");
const path = require("path");
const os = require("os");

const CONFIG_DIR = path.join(os.homedir(), ".envsync");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");
const DEFAULT_API_URL = process.env.ENVSYNC_API_URL || "https://envsync-tqj1.onrender.com";

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function readConfig() {
  ensureConfigDir();

  if (!fs.existsSync(CONFIG_PATH)) {
    return {
      apiBaseUrl: DEFAULT_API_URL,
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return {
      apiBaseUrl: DEFAULT_API_URL,
      ...parsed,
    };
  } catch (err) {
    return {
      apiBaseUrl: DEFAULT_API_URL,
    };
  }
}

function writeConfig(nextConfig) {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(nextConfig, null, 2), {
    mode: 0o600,
  });
}

function updateConfig(patch) {
  const current = readConfig();
  const nextConfig = {
    ...current,
    ...patch,
  };

  writeConfig(nextConfig);
  return nextConfig;
}

function saveSession({ token, user, activeProjectId, apiBaseUrl }) {
  const current = readConfig();
  return updateConfig({
    token,
    user,
    activeProjectId: activeProjectId ?? null,
    apiBaseUrl: apiBaseUrl || current.apiBaseUrl || DEFAULT_API_URL,
  });
}

function clearSession() {
  const current = readConfig();
  writeConfig({
    apiBaseUrl: current.apiBaseUrl || DEFAULT_API_URL,
    activeProjectId: null,
  });
}

function getToken() {
  return readConfig().token || null;
}

module.exports = {
  CONFIG_PATH,
  DEFAULT_API_URL,
  clearSession,
  getToken,
  readConfig,
  saveSession,
  updateConfig,
};
