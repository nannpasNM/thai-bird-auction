const express = require("express");
const router = express.Router();

const {
  getAll,
  create,
  createHistory,
  getAuctionHistory,
  updateState,
} = require("../controllers/auctionController");

router.get("/searchBirdAuction", getAll);

router.post("/createBirdAuction", create);

router.post("/createAuctionHistory", createHistory);

router.get("/auctionHistory/:auctionId", getAuctionHistory);
module.exports = router;
