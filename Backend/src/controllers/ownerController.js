const pool = require("../config/db");

async function getOwnerDashboard(req, res) {
  try {
    const ownerId = req.user.id;
    const storeResult = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address
      FROM stores s
      WHERE s.owner_id = $1
      `,
      [ownerId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        message: "No store is assigned to this owner"
      });
    }

    const store = storeResult.rows[0];

    const ratingResult = await pool.query(
      `
      SELECT
        COALESCE(
          ROUND(AVG(rating), 2),
          0
        ) AS average_rating,
        COUNT(*)::int AS total_ratings
      FROM ratings
      WHERE store_id = $1
      `,
      [store.id]
    );

    const usersResult = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        r.rating,
        r.created_at AS rated_at,
        r.updated_at AS rating_updated_at
      FROM ratings r
      INNER JOIN users u
        ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.updated_at DESC
      `,
      [store.id]
    );

    res.status(200).json({
      message: "Owner dashboard fetched successfully",

      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,

        averageRating:
          ratingResult.rows[0].average_rating,

        totalRatings:
          ratingResult.rows[0].total_ratings
      },

      ratedUsers: usersResult.rows
    });

  } catch (error) {
    console.error(
      "Owner dashboard error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch owner dashboard"
    });
  }
}

module.exports = {
  getOwnerDashboard
};