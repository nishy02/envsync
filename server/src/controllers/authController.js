const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
        [String(email).trim().toLowerCase(), hashed]
      );

      const userId = result.rows[0].id;

      const projectResult = await client.query(
        "INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING id",
        ["Default Project", userId]
      );

      await client.query(
        `
          INSERT INTO project_members (project_id, user_id, role)
          VALUES ($1, $2, 'owner')
          ON CONFLICT (project_id, user_id) DO NOTHING
        `,
        [projectResult.rows[0].id, userId]
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    res.json({ msg: "User registered successfully" });

  } catch (err) {
    console.error("Register error:", err.message);

    if (err.code === "23505") {
      return res.status(400).json({ msg: "User already exists" });
    }

    res.status(500).json({ msg: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = $1",
      [String(email).trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error logging in" });
  }
};
