const Transaction = require("../models/Transaction");
const ApiError = require("../error/ApiError");
const ObjectId = require("mongoose").Types.ObjectId;
const Plant = require("../models/Plant");

class TransactionController {
  async register(req, res, next) {
    const { plantIds } = req.body;

    if (!plantIds) {
      return next(ApiError.badRequest("Не plantIds!"));
    }

    let price = 0;
    plantIds.forEach(async (id) => {
      const plant = await Plant.findById(id);
      if (!plant) {
        return next(ApiError.badRequest("Не верный plantIds!"));
      }
      price += plant.price;
    });

    const { _id: userId } = req.user;
    const newTransaction = new Transaction({
      plantIds,
      userId,
    });
    await newTransaction.save();

    return res.status(200).json({ price });
  }

  async getAll(req, res, next) {
    const transactions = await Transaction.find();
    return res.status(200).json(transactions);
  }

  async deleteOne(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return next(ApiError.badRequest("Не задан _id!"));
    }

    const transaction = await Transaction.findById(_id);
    if (!transaction) {
      return next(ApiError.badRequest("Транзакция с таким _id не существует!"));
    }
    await transaction.deleteOne();

    return res.status(200).json("Транзакция удалена");
  }
}

module.exports = new TransactionController();
