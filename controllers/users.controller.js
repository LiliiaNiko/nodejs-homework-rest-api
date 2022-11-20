const { User } = require("../models/user.model");

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

module.exports = {
  getContacts,
  createContact,
};
