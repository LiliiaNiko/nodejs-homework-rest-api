const { User } = require("../models/user.model");
const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const Jimp = require("jimp");

async function getContacts(req, res, next) {
  const { user } = req;

  return res.status(200).json({
    data: {
      owner: user.owner,
    },
  });
}

async function createContact(req, res, next) {
  const { _id } = req.body;
  const { user } = req;
  user.owner.push(_id);
  await User.findByIdAndUpdate(user._id, user);
  return res.status(201).json({
    data: {
      owner: user.owner,
    },
  });
}

async function updateAvatar(req, res, next) {
  const { user } = req;
  console.log(req.file);
  const newPath = path.join(__dirname, "../public/avatars", req.file.filename);
  await fs.rename(req.file.path, newPath);
  Jimp.read(newPath, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).write(newPath);
  });
  const userAvatar = "../public/avatars" + "/" + nanoid() + req.file.filename;
  await User.findOneAndUpdate(
    user,
    {
      avatarURL: userAvatar,
    },
    { new: true }
  );
  return res.status(201).json({ data: { avatarURL: userAvatar } });
}

module.exports = {
  getContacts,
  createContact,
  updateAvatar,
};
