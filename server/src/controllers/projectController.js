const pool = require("../db");
const { listAccessibleProjects, getAccessibleProject } = require("../utils/projects");

exports.listProjects = async (req, res) => {
  try {
    const projects = await listAccessibleProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    console.error("List projects error:", err.message);
    res.status(500).json({ msg: "Error fetching projects" });
  }
};

exports.createProject = async (req, res) => {
  const name = String(req.body.name || "").trim();

  if (!name) {
    return res.status(400).json({ msg: "Project name is required" });
  }

  try {
    const client = await pool.connect();

    let project;

    try {
      await client.query("BEGIN");

      const projectResult = await client.query(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING id, name, owner_id",
        [name, req.user.id]
      );

      project = projectResult.rows[0];

      await client.query(
        `
          INSERT INTO project_members (project_id, user_id, role)
          VALUES ($1, $2, 'owner')
          ON CONFLICT (project_id, user_id) DO NOTHING
        `,
        [project.id, req.user.id]
      );

      await client.query(
        "INSERT INTO audit_logs (user_id, action, project_id) VALUES ($1, $2, $3)",
        [req.user.id, "CREATE_PROJECT", project.id]
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    res.status(201).json({
      id: project.id,
      name: project.name,
      owner_id: project.owner_id,
      role: "owner",
    });
  } catch (err) {
    console.error("Create project error:", err.message);
    res.status(500).json({ msg: "Error creating project" });
  }
};

exports.shareProject = async (req, res) => {
  const projectId = Number(req.params.projectId);
  const email = String(req.body.email || "").trim().toLowerCase();
  const role = String(req.body.role || "viewer").trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ msg: "Target email is required" });
  }

  if (!["viewer", "editor"].includes(role)) {
    return res.status(400).json({ msg: "Role must be viewer or editor" });
  }

  try {
    const project = await getAccessibleProject(req.user.id, projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found or access denied" });
    }

    if (project.role !== "owner") {
      return res.status(403).json({ msg: "Only project owners can share projects" });
    }

    const userResult = await pool.query(
      "SELECT id, email FROM users WHERE LOWER(email) = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const targetUser = userResult.rows[0];

    await pool.query(
      `
        INSERT INTO project_members (project_id, user_id, role)
        VALUES ($1, $2, $3)
        ON CONFLICT (project_id, user_id)
        DO UPDATE SET role = EXCLUDED.role
      `,
      [projectId, targetUser.id, role]
    );

    await pool.query(
      "INSERT INTO audit_logs (user_id, action, project_id) VALUES ($1, $2, $3)",
      [req.user.id, `SHARE_${role.toUpperCase()}`, projectId]
    );

    res.json({
      msg: "Project shared successfully",
      project: {
        id: projectId,
        name: project.name,
      },
      sharedWith: targetUser.email,
      role,
    });
  } catch (err) {
    console.error("Share project error:", err.message);
    res.status(500).json({ msg: "Error sharing project" });
  }
};
