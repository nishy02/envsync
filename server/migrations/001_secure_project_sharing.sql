BEGIN;

CREATE TABLE IF NOT EXISTS project_members (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

ALTER TABLE secrets
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

INSERT INTO project_members (project_id, user_id, role)
SELECT p.id, p.owner_id, 'owner'
FROM projects p
ON CONFLICT (project_id, user_id) DO NOTHING;

WITH ranked AS (
  SELECT
    ctid,
    ROW_NUMBER() OVER (
      PARTITION BY project_id, key
      ORDER BY updated_at DESC, ctid DESC
    ) AS row_num
  FROM secrets
)
DELETE FROM secrets
WHERE ctid IN (
  SELECT ctid
  FROM ranked
  WHERE row_num > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS secrets_project_id_key_key
  ON secrets(project_id, key);

COMMIT;
