const pool = require("../db");

async function getAccessibleProject(userId, projectId) {
  if (!projectId) {
    return null;
  }

  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.owner_id,
        CASE
          WHEN p.owner_id = $1 THEN 'owner'
          ELSE COALESCE(pm.role, 'viewer')
        END AS role
      FROM projects p
      LEFT JOIN project_members pm
        ON pm.project_id = p.id
       AND pm.user_id = $1
      WHERE p.id = $2
        AND (p.owner_id = $1 OR pm.user_id = $1)
      LIMIT 1
    `,
    [userId, projectId]
  );

  return result.rows[0] || null;
}

async function listAccessibleProjects(userId) {
  const result = await pool.query(
    `
      SELECT DISTINCT
        p.id,
        p.name,
        p.owner_id,
        CASE
          WHEN p.owner_id = $1 THEN 'owner'
          ELSE COALESCE(pm.role, 'viewer')
        END AS role
      FROM projects p
      LEFT JOIN project_members pm
        ON pm.project_id = p.id
       AND pm.user_id = $1
      WHERE p.owner_id = $1 OR pm.user_id = $1
      ORDER BY p.id ASC
    `,
    [userId]
  );

  return result.rows;
}

async function getOrCreateDefaultProject(userId) {
  const existing = await pool.query(
    `
      SELECT id, name, owner_id, 'owner' AS role
      FROM projects
      WHERE owner_id = $1
      ORDER BY id ASC
      LIMIT 1
    `,
    [userId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const created = await pool.query(
    `
      WITH inserted_project AS (
        INSERT INTO projects (name, owner_id)
        VALUES ($1, $2)
        RETURNING id, name, owner_id
      )
      INSERT INTO project_members (project_id, user_id, role)
      SELECT id, $2, 'owner'
      FROM inserted_project
      RETURNING project_id
    `,
    ["Default Project", userId]
  );

  return {
    id: created.rows[0].project_id,
    name: "Default Project",
    owner_id: userId,
    role: "owner",
  };
}

module.exports = {
  getAccessibleProject,
  getOrCreateDefaultProject,
  listAccessibleProjects,
};
