#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const axios = require("axios");
const readline = require("readline-sync");
const readEnvFile = require("./utils/readEnv");
const writeEnvFile = require("./utils/writeEnv");
const { saveToken } = require("./utils/config");
const { getToken } = require("./utils/config");

program
  .command("push")
  .description("Push .env to server")
  .action(async () => {
    try {
      const secrets = readEnvFile();
      const token = getToken();
      if (!token) {
        console.log("Please login first using 'envsync login'");
        return;
        }

      const res = await axios.post(
        "https://envsync-tqj1.onrender.com/secrets/push",
        {
          project_id: 1,
          secrets,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
    } catch (err) {
        console.error("Push failed:", err.response?.data || err.message);
    }
  });

program
  .command("pull")
  .description("Pull .env from server")
  .action(async () => {
    try {
      const token = getToken();

      if (!token) {
        console.log("Please login first using 'envsync login'");
        return;
      }

      const res = await axios.get(
        "https://envsync-tqj1.onrender.com/secrets/pull?project_id=1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      writeEnvFile(res.data);

      console.log("Secrets pulled successfully");
    } catch (err) {
      console.error("Pull failed:", err.response?.data || err.message);
    }
  });

program
  .command("login")
  .description("Login to EnvSync")
  .action(async () => {
    const email = readline.question("Email: ");
    const password = readline.question("Password: ", {
      hideEchoBack: true,
    });

    try {
      const res = await axios.post(
        "https://envsync-tqj1.onrender.com/auth/login",
        { email, password }
      );

      saveToken(res.data.token);

      console.log("Login successful");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  });

program.parse(process.argv);
