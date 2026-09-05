const pool = require("../config/db");
async function getUserStores(req, res) {
  try {
    const {
      search,
      name,
      address,
      sortBy = "id",
      order = "desc"
    } = req.query;

    const userId = req.user.id;
    const values = [userId];
    const conditions = [];

   
    if (search && search.trim() !== "") {
      values.push(`%${search.trim()}%`);

      conditions.push(`
        (
          s.name ILIKE $${values.length}
          OR s.address ILIKE $${values.length}
        )
      `);
    }
    if (name && name.trim() !== "") {
      values.push(`%${name.trim()}%`);

      conditions.push(
        `s.name ILIKE $${values.length}`
      );
    }
    if (address && address.trim() !== "") {
      values.push(`%${address.trim()}%`);

      conditions.push(
        `s.address ILIKE $${values.length}`
      );
    }

    const allowedSortFields = {
      id: "s.id",
      name: "s.name",
      address: "s.address",
      overall_rating: "overall_rating",
      user_rating: "user_rating"
    };

    const sortColumn =
      allowedSortFields[sortBy] || "s.id";

    const sortOrder =
      order?.toLowerCase() === "asc"
        ? "ASC"
        : "DESC";

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const query = `
      SELECT
        s.id,
        s.name,
        s.address,

        COALESCE(
          ROUND(AVG(all_ratings.rating), 2),
          0
        ) AS overall_rating,

        my_rating.rating AS user_rating

      FROM stores s

      LEFT JOIN ratings all_ratings
        ON s.id = all_ratings.store_id

      LEFT JOIN ratings my_rating
        ON s.id = my_rating.store_id
        AND my_rating.user_id = $1

      ${whereClause}

      GROUP BY
        s.id,
        s.name,
        s.address,
        my_rating.rating

      ORDER BY ${sortColumn} ${sortOrder}
    `;

    const result = await pool.query(
      query,
      values
    );

    res.status(200).json({
      message: "Stores fetched successfully",
      count: result.rows.length,
      stores: result.rows
    });

  } catch (error) {
    console.error(
      "Get user stores error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch stores"
    });
  }
}

async function rateStore(req, res) {
  try {
    const userId = req.user.id;
    const storeId = Number(req.params.storeId);

    const { rating } = req.body || {};

    if (
      !Number.isInteger(storeId) ||
      storeId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid store ID"
      });
    }
    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5"
      });
    }

    const storeResult = await pool.query(
      `
      SELECT id
      FROM stores
      WHERE id = $1
      `,
      [storeId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }
    const existingRating = await pool.query(
      `
      SELECT id
      FROM ratings
      WHERE user_id = $1
      AND store_id = $2
      `,
      [userId, storeId]
    );
    if (existingRating.rows.length > 0) {
      const result = await pool.query(
        `
        UPDATE ratings
        SET
          rating = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
        AND store_id = $3
        RETURNING
          id,
          user_id,
          store_id,
          rating,
          created_at,
          updated_at
        `,
        [rating, userId, storeId]
      );

      return res.status(200).json({
        message: "Rating updated successfully",
        rating: result.rows[0]
      });
    }
    const result = await pool.query(
      `
      INSERT INTO ratings
        (user_id, store_id, rating)
      VALUES
        ($1, $2, $3)
      RETURNING
        id,
        user_id,
        store_id,
        rating,
        created_at,
        updated_at
      `,
      [userId, storeId, rating]
    );

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: result.rows[0]
    });

  } catch (error) {
    console.error(
      "Rate store error:",
      error
    );

    res.status(500).json({
      message: "Failed to submit rating"
    });
  }
}


module.exports = {
  getUserStores,
  rateStore
};