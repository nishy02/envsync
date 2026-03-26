#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const axios = require("axios");
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

      const res = await axios.post(
        "http://localhost:5000/secrets/push",
        {
          project_id: 1,
          secrets,
        },
        {
          headers: {
            Authorization: token,
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
        "http://localhost:5000/secrets/pull?project_id=1",
        {
          headers: {
            Authorization: token,
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
    const email = "test@gmail.com";
    const password = "123456";

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password }
      );

      saveToken(res.data.token);

      console.log("Login successful");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  });

program.parse(process.argv);