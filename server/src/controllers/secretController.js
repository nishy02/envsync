const pool = require("../db");
const { encrypt, decrypt } = require("../utils/encryption");

exports.pushSecrets = async (req, res) => {
  try {
    const { secrets } = req.body;

    const projectRes = await pool.query(
      "SELECT id FROM projects WHERE owner_id = $1",
      [req.user.id]
    );

    let project_id;

    if (projectRes.rows.length === 0) {
      const newProject = await pool.query(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING id",
        ["Default Project", req.user.id]
      );

      project_id = newProject.rows[0].id;
    } else {
      project_id = projectRes.rows[0].id;
    }

    for (let key in secrets) {
      const encrypted = encrypt(secrets[key]);

      await pool.query(
        "INSERT INTO secrets (project_id, key, value_encrypted) VALUES ($1, $2, $3)",
        [project_id, key, encrypted]
      );
    }

    await pool.query(
      "INSERT INTO audit_logs (user_id, action, project_id) VALUES ($1, $2, $3)",
      [req.user.id, "PUSH", project_id]
    );

    res.json({ msg: "Secrets stored securely" });

  } catch (err) {
    console.error("Push error:", err.message);
    res.status(500).json({ msg: "Error storing secrets" });
  }
};

exports.getSecrets = async (req, res) => {
  try {
    let projectRes = await pool.query(
      "SELECT id FROM projects WHERE owner_id = $1",
      [req.user.id]
    );

    let project_id;

    if (projectRes.rows.length === 0) {
      const newProject = await pool.query(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING id",
        ["Default Project", req.user.id]
      );

      project_id = newProject.rows[0].id;
    } else {
      project_id = projectRes.rows[0].id;
    }

    const result = await pool.query(
      "SELECT key, value_encrypted FROM secrets WHERE project_id = $1",
      [project_id]
    );

    const secrets = {};

    result.rows.forEach((row) => {
      secrets[row.key] = decrypt(row.value_encrypted);
    });

    await pool.query(
      "INSERT INTO audit_logs (user_id, action, project_id) VALUES ($1, $2, $3)",
      [req.user.id, "PULL", project_id]
    );

    res.json(secrets);

  } catch (err) {
    console.error("Pull error:", err.message);
    res.status(500).json({ msg: "Error fetching secrets" });
  }
};