const bcrypt = require("bcrypt");
const User = require("../models/User");
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;

const generateJwt = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async register(req, res, next) {
    const { email, password, role } = req.body;

    if (!email) {
      return next(ApiError.badRequest("Не задан email!"));
    }

    if (!password) {
      return next(ApiError.badRequest("Не задан password!"));
    }

    const candidate = await User.findOne({ email: email });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует!")
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      role: role,
    });
    const user = await newUser.save();

    const token = generateJwt(user._id, user.role);
    res.status(200).json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return next(
        ApiError.badRequest("Пользователь с таким email не существует!")
      );
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return next(ApiError.badRequest("Пароль не верный!"));
    }

    const token = generateJwt(user._id, user.role);
    return res.status(200).json({ token });
  }

  async check(req, res) {
    const { user } = req;
    const token = generateJwt(user._id, user.role);
    return res.status(200).json({ token });
  }

  async getOne(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return next(ApiError.badRequest("Не задан _id!"));
    }

    if (!ObjectId.isValid(_id)) {
      return next(ApiError.badRequest("Не валидный _id!"));
    }

    const user = await User.findById(_id);
    return res.status(200).json({ user });
  }

  async getAll(req, res) {
    const users = await User.find();
    return res.status(200).json(users);
  }

  async deleteOne(req, res, next) {
    const { _id } = req.params;
    if (!_id) {
      return next(ApiError.badRequest("Не задан _id!"));
    }

    const user = await User.findById(_id);

    if (!user) {
      return next(
        ApiError.badRequest("Пользователя с таким _id не существует!")
      );
    }

    await user.deleteOne();

    return res.status(200).json("Пользователь удалён");
  }

  async deleteAll(req, res) {
    await User.deleteMany();
    return res.status(200).json("Все пользователи удалены");
  }

  async updateOne(req, res, next) {
    const { user: currentUser } = req;

    if (!req.body.user) {
      return next(ApiError.badRequest("Не заданы обновлённые данные!"));
    }
    let { _id, role, __v, wishlist, ...user } = req.body.user;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.dateOfBirth = new Date(user.dateOfBirth);
    if (isNaN(Date.parse(user.dateOfBirth))) {
      return next(ApiError.badRequest("Не верный формат года рождения!"));
    }

    const findedUser = await User.findById(currentUser._id);
    if (!findedUser) {
      return next(
        ApiError.badRequest("Пользователя с таким _id не существует!")
      );
    }
    await findedUser.update(user);

    return res.status(200).json("Аккаунт был успешно обновлён");
  }

  async addPlant(req, res, next) {
    const { plantId } = req.params;
    if (!plantId) {
      return next(ApiError.badRequest("Не задан plantId!"));
    }

    const { _id: userId } = req.user;
    const user = await User.findById(userId);

    user.wishlist.push(plantId);
    user.markModified("wishlist");
    await user.save();

    return res.status(200).json("Растение добавлено в список желаний");
  }

  async removePlant(req, res, next) {
    const { plantId } = req.params;
    if (!plantId) {
      return next(ApiError.badRequest("Не задан plantId!"));
    }

    const { _id: userId } = req.user;
    let user = await User.findById(userId);

    user.wishlist = user.wishlist.filter((id) => {
      return id !== plantId;
    });
    user.markModified("wishlist");
    await user.save();

    return res.status(200).json("Растение удалено из списка желаний");
  }
}

module.exports = new UserController();
