const { Contact } = require("../models/contact.model");
const { createNotFoundHttpError } = require("../helpers/index");

async function getAll(req, res, next) {
  const contacts = await Contact.find();
  return res.json({
    data: contacts,
  });
}

async function create(req, res, next) {
  const createdContact = await Contact.create(req.body);
  return res.status(201).json({
    data: {
      contact: createdContact,
    },
  });
}

async function deleteById(req, res, next) {
  const { id } = req.params;
  const { _id } = req.body;
  const contact = await Contact.findOneAndDelete({ id, owner: _id });

  if (!contact) {
    return next(createNotFoundHttpError());
  }
  return res.json({
    data: { contact },
  });
}

async function updateById(req, res, next) {
  const { id } = req.params;

  const updatedContact = await Contact.findOneAndUpdate(id, req.body, {
    new: true,
  });
  return res.json({
    data: {
      contact: updatedContact,
    },
  });
}

async function findOneById(req, res, next) {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (contact) {
    return res.json({
      data: { contact },
    });
  }
  return next(createNotFoundHttpError());
}

async function updateStatusContact(req, res, next) {
  const { id } = req.params;
  const { favorite } = req.body;
  if (!favorite) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json({
    data: {
      contact: updatedContact,
    },
  });
}

module.exports = {
  getAll,
  create,
  deleteById,
  updateById,
  findOneById,
  updateStatusContact,
};
