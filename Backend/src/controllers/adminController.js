const pool = require("../config/db");
const { hashPassword } = require("../utils/password");

async function getDashboard(req, res) {
  try {
    const usersResult = await pool.query(`
      SELECT COUNT(*)::int AS total_users
      FROM users
      WHERE role = 'USER'
    `);

    const storesResult = await pool.query(`
      SELECT COUNT(*)::int AS total_stores
      FROM stores
    `);

    const ratingsResult = await pool.query(`
      SELECT COUNT(*)::int AS total_ratings
      FROM ratings
    `);

    res.status(200).json({
      totalUsers: usersResult.rows[0].total_users,
      totalStores: storesResult.rows[0].total_stores,
      totalRatings: ratingsResult.rows[0].total_ratings,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch admin dashboard",
    });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body || {};

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        message: "Name, email, password, address and role are required",
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 20 || trimmedName.length > 60) {
      return res.status(400).json({
        message: "Name must be between 20 and 60 characters",
      });
    }
    const trimmedAddress = address.trim();

    if (trimmedAddress.length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
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

    const allowedRoles = ["USER", "ADMIN", "OWNER"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Role must be USER, ADMIN or OWNER",
      });
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [trimmedEmail],
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
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        email,
        address,
        role,
        created_at
      `,
      [trimmedName, trimmedEmail, hashedPassword, trimmedAddress, role],
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
}
async function getUsers(req, res) {
  try {
    const {
      search,
      name,
      email,
      address,
      role,
      sortBy = "id",
      order = "desc",
    } = req.query;

    const values = [];
    const conditions = [];

    if (search && search.trim() !== "") {
      values.push(`%${search.trim()}%`);

      conditions.push(`
        (
          u.name ILIKE $${values.length}
          OR u.email ILIKE $${values.length}
          OR u.address ILIKE $${values.length}
        )
      `);
    }

    if (name && name.trim() !== "") {
      values.push(`%${name.trim()}%`);

      conditions.push(`u.name ILIKE $${values.length}`);
    }
    if (email && email.trim() !== "") {
      values.push(`%${email.trim()}%`);

      conditions.push(`u.email ILIKE $${values.length}`);
    }

    if (address && address.trim() !== "") {
      values.push(`%${address.trim()}%`);

      conditions.push(`u.address ILIKE $${values.length}`);
    }

    if (role && role.trim() !== "") {
      const allowedRoles = ["USER", "ADMIN", "OWNER"];

      const requestedRole = role.trim().toUpperCase();

      if (!allowedRoles.includes(requestedRole)) {
        return res.status(400).json({
          message: "Role must be USER, ADMIN or OWNER",
        });
      }

      values.push(requestedRole);

      conditions.push(`u.role = $${values.length}`);
    }

    const allowedSortFields = {
      id: "u.id",
      name: "u.name",
      email: "u.email",
      address: "u.address",
      role: "u.role",
    };

    const sortColumn = allowedSortFields[sortBy] || "u.id";
    const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        u.created_at

      FROM users u

      ${whereClause}

      ORDER BY ${sortColumn} ${sortOrder}
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "Users fetched successfully",
      count: result.rows.length,
      users: result.rows,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
}

async function getUserDetails(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }
    const userResult = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        address,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const user = userResult.rows[0];
    if (user.role === "OWNER") {
      const storeResult = await pool.query(
        `
        SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          s.owner_id,
          COALESCE(
            ROUND(AVG(r.rating), 2),
            0
          ) AS overall_rating
        FROM stores s
        LEFT JOIN ratings r
          ON s.id = r.store_id
        WHERE s.owner_id = $1
        GROUP BY
          s.id,
          s.name,
          s.email,
          s.address,
          s.owner_id
        `,
        [userId],
      );

      user.store = storeResult.rows[0] || null;
    }
    res.status(200).json({
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get user details error:", error);

    res.status(500).json({
      message: "Failed to fetch user details",
    });
  }
}

async function getStoreOwners(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.email
      FROM users u
      LEFT JOIN stores s
        ON s.owner_id = u.id
      WHERE u.role = 'OWNER'
        AND s.id IS NULL
      ORDER BY u.name ASC
    `);

    res.status(200).json({
      message: "Available store owners fetched successfully",
      owners: result.rows,
    });
  } catch (error) {
    console.error("Get store owners error:", error);

    res.status(500).json({
      message: "Failed to fetch store owners",
    });
  }
}

module.exports = {
  getDashboard,
  createUser,
  getUsers,
  getUserDetails,
  getStoreOwners,
};
