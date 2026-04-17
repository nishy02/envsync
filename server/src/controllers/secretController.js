const pool = require("../db");
const { encrypt, decrypt } = require("../utils/encryption");
const {
  getAccessibleProject,
  getOrCreateDefaultProject,
} = require("../utils/projects");

function normalizeSecrets(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const normalized = {};

  for (const [key, value] of Object.entries(input)) {
    if (!key || typeof key !== "string") {
      continue;
    }

    normalized[key.trim()] = value == null ? "" : String(value);
  }

  return normalized;
}

async function resolveProjectForUser(userId, requestedProjectId) {
  if (!requestedProjectId) {
    return getOrCreateDefaultProject(userId);
  }

  return getAccessibleProject(userId, Number(requestedProjectId));
}

exports.pushSecrets = async (req, res) => {
  const secrets = normalizeSecrets(req.body.secrets);

  if (!secrets || Object.keys(secrets).length === 0) {
    return res.status(400).json({ msg: "No secrets provided" });
  }

  try {
    const project = await resolveProjectForUser(req.user.id, req.body.projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found or access denied" });
    }

    if (!["owner", "editor"].includes(project.role)) {
      return res.status(403).json({ msg: "You do not have write access to this project" });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const [key, value] of Object.entries(secrets)) {
        const encrypted = encrypt(value);

        await client.query(
          `
            INSERT INTO secrets (project_id, key, value_encrypted)
            VALUES ($1, $2, $3)
            ON CONFLICT (project_id, key)
            DO UPDATE SET
              value_encrypted = EXCLUDED.value_encrypted,
              updated_at = NOW()
          `,
          [project.id, key, encrypted]
        );
      }

      await client.query(
        "INSERT INTO audit_logs (user_id, action, project_id) VALUES ($1, $2, $3)",
        [req.user.id, "PUSH", project.id]
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    res.json({
      msg: "Secrets stored securely",
      project: {
        id: project.id,
        name: project.name,
        role: project.role,
      },
      secretCount: Object.keys(secrets).length,
    });
  } catch (err) {
    console.error("Push error:", err.message);
    res.status(500).json({ msg: "Error storing secrets" });
  }
};

exports.getSecrets = async (req, res) => {
  try {
    const project = await resolveProjectForUser(req.user.id, req.query.projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found or access denied" });
    }

    const result = await pool.query(
      "SELECT key, value_encrypted FROM secrets WHERE project_id = $1 ORDER BY key ASC",
      [project.id]
    );

    const secrets = {};

    result.rows.forEach((row) => {
      secrets[row.key] = decrypt(row.value_encrypted);
    });

    await pool.query(
      "INSERT INTO audit_logs (user_id, action, project_id) VALUES ($1, $2, $3)",
      [req.user.id, "PULL", project.id]
    );

    res.json({
      project: {
        id: project.id,
        name: project.name,
        role: project.role,
      },
      secrets,
    });
  } catch (err) {
    console.error("Pull error:", err.message);
    res.status(500).json({ msg: "Error fetching secrets" });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await pool.query(
      `
        SELECT
          action,
          project_id,
          timestamp
        FROM audit_logs
        WHERE user_id = $1
        ORDER BY timestamp DESC
      `,
      [req.user.id]
    );

    res.json(logs.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching logs" });
  }
};
