const pool = require("../config/db");

async function createStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body || {};

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({
        message: "Name, email, address and ownerId are required",
      });
    }
    const trimmedName = name.trim();

    if (trimmedName.length < 20 || trimmedName.length > 60) {
      return res.status(400).json({
        message: "Store name must be between 20 and 60 characters",
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
    const parsedOwnerId = Number(ownerId);

    if (!Number.isInteger(parsedOwnerId) || parsedOwnerId <= 0) {
      return res.status(400).json({
        message: "ownerId must be a valid user ID",
      });
    }

    const ownerResult = await pool.query(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = $1
      `,
      [parsedOwnerId],
    );

    if (ownerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Owner not found",
      });
    }

    const owner = ownerResult.rows[0];

    if (owner.role !== "OWNER") {
      return res.status(400).json({
        message: "Selected user is not a store owner",
      });
    }

    const existingStore = await pool.query(
      `
      SELECT id
      FROM stores
      WHERE email = $1
      `,
      [trimmedEmail],
    );

    if (existingStore.rows.length > 0) {
      return res.status(409).json({
        message: "Store email is already registered",
      });
    }

    const ownerStore = await pool.query(
      `
      SELECT id
      FROM stores
      WHERE owner_id = $1
      `,
      [parsedOwnerId],
    );

    if (ownerStore.rows.length > 0) {
      return res.status(409).json({
        message: "This owner already has a store",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO stores
        (name, email, address, owner_id)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        email,
        address,
        owner_id,
        created_at
      `,
      [trimmedName, trimmedEmail, trimmedAddress, parsedOwnerId],
    );

    res.status(201).json({
      message: "Store created successfully",
      store: result.rows[0],
    });
  } catch (error) {
    console.error("Create store error:", error);

    res.status(500).json({
      message: "Failed to create store",
    });
  }
}
async function getStores(req, res) {
  try {
    const {
      search,
      name,
      email,
      address,
      sortBy = "id",
      order = "desc",
    } = req.query;

    const values = [];
    const conditions = [];

    if (search && search.trim() !== "") {
      values.push(`%${search.trim()}%`);

      conditions.push(`
        (
          s.name ILIKE $${values.length}
          OR s.email ILIKE $${values.length}
          OR s.address ILIKE $${values.length}
        )
      `);
    }

    if (name && name.trim() !== "") {
      values.push(`%${name.trim()}%`);

      conditions.push(`s.name ILIKE $${values.length}`);
    }

    if (email && email.trim() !== "") {
      values.push(`%${email.trim()}%`);

      conditions.push(`s.email ILIKE $${values.length}`);
    }
    if (address && address.trim() !== "") {
      values.push(`%${address.trim()}%`);

      conditions.push(`s.address ILIKE $${values.length}`);
    }

    const allowedSortFields = {
      id: "s.id",
      name: "s.name",
      email: "s.email",
      address: "s.address",
      overall_rating: "overall_rating",
    };

    const sortColumn = allowedSortFields[sortBy] || "s.id";

    const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        u.name AS owner_name,
        u.email AS owner_email,
        COALESCE(
          ROUND(AVG(r.rating), 2),
          0
        ) AS overall_rating

      FROM stores s

      LEFT JOIN users u
        ON s.owner_id = u.id

      LEFT JOIN ratings r
        ON s.id = r.store_id

      ${whereClause}

      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        u.name,
        u.email

      ORDER BY ${sortColumn} ${sortOrder}
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "Stores fetched successfully",
      count: result.rows.length,
      stores: result.rows,
    });
  } catch (error) {
    console.error("Get stores error:", error);

    res.status(500).json({
      message: "Failed to fetch stores",
    });
  }
}

module.exports = {
  createStore,
  getStores,
};
