const connection = require("../config/db");

/**
 * 🔥 ดึง auctions (ต้องมี state + winner + currentBid)
 */
const findAll = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        id,
        name,
        breed,
        base_price AS basePrice,
        current_bid AS currentBid,
        bidder,
        winner,
        certified,
        state,
        image
      FROM auctions
      ORDER BY id DESC
    `;

    connection.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

/**
 * 🔥 สร้าง auction (ต้อง set state = live + init bid)
 */
const create = (auction) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO auctions
      (name, breed, base_price, current_bid, image, state, bidder, winner, certified)
      VALUES (?, ?, ?, ?, ?, 'live', NULL, NULL, 0)
    `;

    connection.query(
      sql,
      [
        auction.name,
        auction.breed,
        auction.base_price,
        auction.base_price, // initial bid = base price
        auction.image,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

/**
 * 🔥 count
 */
const count = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT COUNT(*) AS total FROM auctions",
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      },
    );
  });
};

module.exports = {
  findAll,
  create,
  count,
};
