#!/usr/bin/env node

const { Command } = require("commander");
const readline = require("readline-sync");
const { createApiClient } = require("./utils/api");
const { readEnvFile, resolveEnvPath: resolveReadPath } = require("./utils/readEnv");
const { writeEnvFile, resolveEnvPath: resolveWritePath } = require("./utils/writeEnv");
const {
  clearSession,
  CONFIG_PATH,
  getToken,
  readConfig,
  saveSession,
  updateConfig,
} = require("./utils/config");
const pkg = require("./package.json");

const program = new Command();

function requireAuth() {
  if (!getToken()) {
    console.log("Please login first using 'envsync login'");
    process.exit(1);
  }
}

function promptCredentials() {
  const email = readline.question("Email: ").trim().toLowerCase();
  const password = readline.question("Password: ", {
    hideEchoBack: true,
  });

  return { email, password };
}

function resolveProjectId(optionProjectId) {
  const config = readConfig();
  return optionProjectId || config.activeProjectId || null;
}

function printProject(project) {
  return `${project.name} (#${project.id}, ${project.role})`;
}

function handleError(prefix, err) {
  console.error(`${prefix}:`, err.response?.data?.msg || err.response?.data || err.message);
}

program
  .name("envsync")
  .description("Securely sync and share .env files across projects")
  .version(pkg.version);

program
  .command("register")
  .description("Create a new EnvSync account")
  .action(async () => {
    const { email, password } = promptCredentials();

    try {
      const api = createApiClient();
      await api.post("/auth/register", { email, password });
      console.log("Registration successful. Run 'envsync login' to start syncing.");
    } catch (err) {
      handleError("Registration failed", err);
    }
  });

program
  .command("login")
  .description("Login to EnvSync")
  .action(async () => {
    const { email, password } = promptCredentials();

    try {
      const api = createApiClient();
      const res = await api.post("/auth/login", { email, password });

      saveSession({
        token: res.data.token,
        user: res.data.user,
      });

      console.log(`Login successful as ${res.data.user.email}`);
    } catch (err) {
      handleError("Login failed", err);
    }
  });

program
  .command("logout")
  .description("Remove the locally stored session")
  .action(() => {
    clearSession();
    console.log(`Logged out. Local config kept at ${CONFIG_PATH}`);
  });

program
  .command("whoami")
  .description("Show the current CLI session")
  .action(() => {
    const config = readConfig();

    if (!config.token || !config.user) {
      console.log("Not logged in");
      return;
    }

    console.log(`Signed in as ${config.user.email}`);
    console.log(`API: ${config.apiBaseUrl}`);
    console.log(`Active project: ${config.activeProjectId || "not set"}`);
  });

program
  .command("push")
  .description("Push a local .env file to EnvSync")
  .option("-f, --file <path>", "Path to the env file", ".env")
  .option("-p, --project <id>", "Project ID to target")
  .action(async (options) => {
    requireAuth();

    try {
      const secrets = readEnvFile(options.file);
      const projectId = resolveProjectId(options.project);
      const api = createApiClient();

      const res = await api.post("/secrets/push", {
        projectId,
        secrets,
      });

      console.log(
        `Pushed ${res.data.secretCount} secrets from ${resolveReadPath(options.file)} to ${printProject(res.data.project)}`
      );
    } catch (err) {
      handleError("Push failed", err);
    }
  });

program
  .command("pull")
  .description("Pull secrets from EnvSync into a local .env file")
  .option("-f, --file <path>", "Path to write the env file", ".env")
  .option("-p, --project <id>", "Project ID to target")
  .action(async (options) => {
    requireAuth();

    try {
      const projectId = resolveProjectId(options.project);
      const api = createApiClient();
      const res = await api.get("/secrets/pull", {
        params: {
          projectId,
        },
      });

      const outputPath = writeEnvFile(res.data.secrets, options.file);
      console.log(`Pulled ${Object.keys(res.data.secrets).length} secrets into ${outputPath} from ${printProject(res.data.project)}`);
    } catch (err) {
      handleError("Pull failed", err);
    }
  });

const projectCommand = program
  .command("projects")
  .description("Manage EnvSync projects");

projectCommand
  .command("list")
  .description("List projects you can access")
  .action(async () => {
    requireAuth();

    try {
      const api = createApiClient();
      const res = await api.get("/projects");
      const activeProjectId = readConfig().activeProjectId;

      if (res.data.length === 0) {
        console.log("No projects found");
        return;
      }

      res.data.forEach((project) => {
        const marker = String(project.id) === String(activeProjectId) ? "*" : " ";
        console.log(`${marker} ${project.id}\t${project.name}\t${project.role}`);
      });
    } catch (err) {
      handleError("Projects list failed", err);
    }
  });

projectCommand
  .command("create <name>")
  .description("Create a new project")
  .action(async (name) => {
    requireAuth();

    try {
      const api = createApiClient();
      const res = await api.post("/projects", { name });

      updateConfig({ activeProjectId: res.data.id });
      console.log(`Created and selected project ${printProject(res.data)}`);
    } catch (err) {
      handleError("Create project failed", err);
    }
  });

projectCommand
  .command("use <projectId>")
  .description("Select the default project for future push/pull commands")
  .action(async (projectId) => {
    requireAuth();

    try {
      const api = createApiClient();
      const res = await api.get("/projects");
      const project = res.data.find((item) => String(item.id) === String(projectId));

      if (!project) {
        console.error("Project not found in your accessible projects");
        process.exit(1);
      }

      updateConfig({ activeProjectId: Number(projectId) });
      console.log(`Active project set to ${printProject(project)}`);
    } catch (err) {
      handleError("Set project failed", err);
    }
  });

projectCommand
  .command("share <projectId> <email>")
  .description("Share a project with another registered user")
  .option("-r, --role <role>", "Role to grant: viewer or editor", "viewer")
  .action(async (projectId, email, options) => {
    requireAuth();

    try {
      const api = createApiClient();
      const res = await api.post(`/projects/${projectId}/share`, {
        email,
        role: options.role,
      });

      console.log(
        `Shared ${res.data.project.name} (#${res.data.project.id}) with ${res.data.sharedWith} as ${res.data.role}`
      );
    } catch (err) {
      handleError("Share project failed", err);
    }
  });

const configCommand = program
  .command("config")
  .description("Manage CLI configuration");

configCommand
  .command("show")
  .description("Print the current CLI config path and values")
  .action(() => {
    const config = readConfig();

    console.log(`Config path: ${CONFIG_PATH}`);
    console.log(`API URL: ${config.apiBaseUrl}`);
    console.log(`Active project: ${config.activeProjectId || "not set"}`);
    console.log(`Logged in: ${config.user?.email || "no"}`);
  });

configCommand
  .command("set-api <url>")
  .description("Set the EnvSync API base URL for this machine")
  .action((url) => {
    updateConfig({ apiBaseUrl: url });
    console.log(`API URL updated to ${url}`);
  });

configCommand
  .command("set-project <projectId>")
  .description("Set the default project ID without fetching the server")
  .action((projectId) => {
    updateConfig({ activeProjectId: Number(projectId) });
    console.log(`Default project set to ${projectId}`);
  });

program
  .command("init")
  .description("Show quick-start instructions for a fresh machine")
  .action(() => {
    console.log("Install globally: npm install -g envsync-cli");
    console.log("Login: envsync login");
    console.log("List projects: envsync projects list");
    console.log("Push local env file: envsync push --file .env");
    console.log(`Current directory env path resolves to ${resolveWritePath(".env")}`);
  });

program.parseAsync(process.argv);
