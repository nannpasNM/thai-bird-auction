const auctionModel = require("../models/auctionModel");

const getAll = async () => {
  return await auctionModel.findAll();
};

const create = async (data) => {
  return await auctionModel.create(data);
};

const updateState = async (id, state) => {
  return await auctionModel.updateState(id, state);
};

module.exports = {
  getAll,
  create,
  updateState,
};
