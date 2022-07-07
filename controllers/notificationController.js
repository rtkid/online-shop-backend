const Notification = require("../models/Notification");
const ApiError = require("../error/ApiError");
const ObjectId = require("mongoose").Types.ObjectId;

class NotificationController {
  async add(req, res, next) {
    const { title, description, img, date } = req.body;

    if (!title) {
      return next(ApiError.badRequest("Не задано оглавление уведомления!"));
    }

    if (!description) {
      return next(ApiError.badRequest("Не задано описание уведомления!"));
    }

    if (!img) {
      return next(ApiError.badRequest("Не задано изображение уведомления!"));
    }

    if (!date) {
      return next(ApiError.badRequest("Не задана дата уведомления!"));
    }
    const formatedDate = new Date(date);
    if (isNaN(Date.parse(formatedDate))) {
      return next(ApiError.badRequest("Не верный формат даты уведомления!"));
    }

    const newNotification = new Notification({
      title,
      description,
      img,
      date: formatedDate,
    });
    await newNotification.save();

    return res.status(200).json("Уведомление добавлено");
  }

  async getAll(req, res, next) {
    const notifications = await Notification.find();
    return res.status(200).json(notifications);
  }

  async deleteOne(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return next(ApiError.badRequest("Не задан _id!"));
    }

    const notification = await Notification.findById(_id);
    if (!notification) {
      return next(
        ApiError.badRequest("Уведомление с таким _id не существует!")
      );
    }
    await notification.deleteOne();

    return res.status(200).json("Уведомление удалено");
  }

  async deleteAll(req, res) {
    await Notification.deleteMany();
    return res.status(200).json("Все уведомления удалены");
  }
}

module.exports = new NotificationController();
