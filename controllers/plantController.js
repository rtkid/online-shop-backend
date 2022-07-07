const Plant = require("../models/Plant");
const ApiError = require("../error/ApiError");
const ObjectId = require("mongoose").Types.ObjectId;

class PlantController {
  async add(req, res, next) {
    const { name, description, price } = req.body;

    if (!name) {
      return next(ApiError.badRequest("Не задано имя растения!"));
    }

    if (!description) {
      return next(ApiError.badRequest("Не задано описание растения!"));
    }

    if (!price) {
      return next(ApiError.badRequest("Не задана цена растения!"));
    }

    const newPlant = new Plant({
      name,
      description,
      price,
    });
    await newPlant.save();

    return res.status(200).json("Растение добавлено");
  }

  async getOne(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return next(ApiError.badRequest("Не задан _id!"));
    }

    if (!ObjectId.isValid(_id)) {
      return next(ApiError.badRequest("Не валидный _id!"));
    }

    const plant = await Plant.findById(_id);
    return res.status(200).json({ plant });
  }

  async getAll(req, res, next) {
    const plants = await Plant.find();
    return res.status(200).json(plants);
  }

  async deleteOne(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return next(ApiError.badRequest("Не задан _id!"));
    }

    const plant = await Plant.findById(_id);
    if (!plant) {
      return next(ApiError.badRequest("Растение с таким _id не существует!"));
    }
    await plant.deleteOne();

    return res.status(200).json("Растение удалено");
  }

  async deleteAll(req, res) {
    await Plant.deleteMany();
    return res.status(200).json("Все растения удалены");
  }

  async updateOne(req, res, next) {
    let { _id, __v, rating, soldCount, ...plant } = req.body.plant;

    const findedPlant = await Plant.findById(_id);
    if (!findedPlant) {
      return next(ApiError.badRequest("Растения с таким _id не существует!"));
    }
    await findedPlant.update(plant);

    return res.status(200).json("Растение было успешно обновлено");
  }

  async rateOne(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return next(ApiError.badRequest("Не задан _id растения!"));
    }

    const { value } = req.body;
    if (!value) {
      return next(ApiError.badRequest("Не задана оценка!"));
    }
    if (value < 0 || value > 5) {
      return next(ApiError.badRequest("Такая оценка не допустима!"));
    }

    const plant = await Plant.findById(_id);
    if (!plant) {
      return next(ApiError.badRequest("Нет растения с таким _id"));
    }

    let isFinded = false;
    plant.rating.forEach((rate) => {
      if (rate.userId === req.user._id) {
        rate.value = value;
        isFinded = true;
        plant.markModified("rating");
      }
    });

    if (!isFinded) {
      plant.rating.push({ userId: req.user._id, value });
    }

    await plant.save();

    return res.status(200).json("Растение оценено!");
  }

  async buyOne(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return next(ApiError.badRequest("Не задан _id растения!"));
    }

    const plant = await Plant.findById(_id);
    if (!plant) {
      return next(ApiError.badRequest("Нет растения с таким _id"));
    }

    plant.soldCount++;
    plant.markModified("soldCount");
    await plant.save();

    return res.status(200).json("Растение было успешно куплено!");
  }
}

module.exports = new PlantController();
