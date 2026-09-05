const pool = require("../config/db");
const { hashPassword, verifyPassword } = require("../utils/password");
const { createToken } = require("../utils/token");

async function register(req, res) {
  try {
    console.log("========== REGISTER ==========");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
    console.log("==============================");

    const { name, email, password, address } = req.body || {};

    if (!name || !email || !password || !address) {
      return res.status(400).json({
        message: "Name, email, password and address are required",
      });
    }
    if (name.trim().length < 20 || name.trim().length > 60) {
      return res.status(400).json({
        message: "Name must be between 20 and 60 characters",
      });
    }
    if (address.trim().length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.trim().toLowerCase()],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }
    const hashedPassword = hashPassword(password);
    const result = await pool.query(
      `
      INSERT INTO users
        (name, email, password, address, role)
      VALUES
        ($1, $2, $3, $4, 'USER')
      RETURNING id, name, email, address, role, created_at
      `,
      [name.trim(), email.trim().toLowerCase(), hashedPassword, address.trim()],
    );

    const user = result.rows[0];
    res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        address,
        role
      FROM users
      WHERE email = $1
      `,
      [email.trim().toLowerCase()],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];
    const passwordValid = verifyPassword(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);
    delete user.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updatePassword(req, res) {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message:
          "Current password, new password and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }
    const result = await pool.query(
      `
      SELECT id, password
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];
    const currentPasswordValid = verifyPassword(currentPassword, user.password);

    if (!currentPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }
    const samePassword = verifyPassword(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }
    const hashedPassword = hashPassword(newPassword);

    await pool.query(
      `
      UPDATE users
      SET
        password = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [hashedPassword, userId],
    );

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);

    res.status(500).json({
      message: "Failed to update password",
    });
  }
}
module.exports = {
  register,
  login,
  updatePassword,
};
