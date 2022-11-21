const { User } = require("../models/user.model");
const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;

  const user = new User({ email, password });
  try {
    await user.save();
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      throw new Conflict("Email in use");
    }
    throw error;
  }

  return res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Email or password is wrong");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Unauthorized("Email or password is wrong");
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "50m",
  });
  user.token = token;
  await User.findByIdAndUpdate(user._id, user);

  return res.json({
    data: {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
}

async function logout(req, res, next) {
  console.log("logout");
  const { user } = req;
  user.token = null;
  await User.findByIdAndUpdate(user._id, user);

  return res.json({});
}

async function currentUser(req, res, next) {
  res.json({
    data: {
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
}

module.exports = {
  register,
  login,
  logout,
  currentUser,
};
