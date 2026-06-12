const auctionService = require("../services/auctionService");
const db = require("../config/db");

const getAll = async (req, res) => {
  try {
    const auctions = await auctionService.getAll();

    res.json(auctions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const result = await auctionService.create(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createHistory = async (req, res) => {
  try {
    const { auction_id, actor, action, state } = req.body;

    db.query(
      `
      INSERT INTO auction_history
      (auction_id, actor, action)
      VALUES (?, ?, ?)
      `,
      [auction_id, actor, action],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        // 🔥 update state ใน DB ตรงนี้แทน
        if (state) {
          await db.promise().query(
            `
            UPDATE auctions
            SET state = ?
            WHERE id = ?
            `,
            [state, auction_id],
          );
        }

        res.json({
          success: true,
          id: result.insertId,
          state: state || null,
        });
      },
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAuctionHistory = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const [rows] = await db.promise().query(
      `
      SELECT
        actor,
        action,
        created_at
      FROM auction_history
      WHERE auction_id = ?
      ORDER BY created_at ASC
      `,
      [auctionId],
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAll,
  create,
  createHistory,
  getAuctionHistory,
};
