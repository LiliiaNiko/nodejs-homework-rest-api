const { User } = require("../models/user.model");
const { Conflict, Unauthorized, NotFound, BadRequest } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const sendGrid = require("@sendgrid/mail");

const dotenv = require("dotenv");
dotenv.config();
const { JWT_SECRET } = process.env;
const { SEND_GRID_API_KEY } = process.env;

async function sendEmail({ token, email }) {
  sendGrid.setApiKey(SEND_GRID_API_KEY);
  const url = `localhost:3000/users/verify/${token}`;
  const emailBody = {
    from: "181516@ukr.net",
    to: email,
    subject: "Please verify your email",
    html: `<h2>Please open this link ${url}<h2>`,
  };
  const response = await sendGrid.send(emailBody);
  console.log("Verification email sent", response);
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken: verificationToken });

  if (!user) {
    throw new NotFound("Not Found");
  }

  if (!user.verify) {
    User.findByIdAndUpdate(user._id, { verify: true });
    return res.json({
      message: "Verification successful",
    });
  }

  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }
}

async function resendVerifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

  if (!email) {
    throw new BadRequest("Missing required field email");
  }

  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }
  if (!user.verify) {
    await sendEmail({ email, token: verificationToken });
    return res.json({
      message: "Verification email sent",
    });
  }
}

async function register(req, res, next) {
  const { email, password } = req.body;
  await User.findOne({ email });
  const result = gravatar.url(email, {
    s: "200",
    r: "pg",
    d: "404",
  });
  const verificationToken = nanoid();
  // console.log(verificationToken);
  const user = new User({
    email,
    password,
    avatarURL: result,
    verificationToken,
  });

  try {
    await user.save();
    await sendEmail({ email, token: verificationToken });
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
      avatarURL: user.avatarURL,
      verificationToken: user.verificationToken,
    },
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized("Email or password is wrong");
  }

  if (!user.verify) {
    throw new Unauthorized("Email is not verified");
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
  verifyEmail,
  resendVerifyEmail,
};
