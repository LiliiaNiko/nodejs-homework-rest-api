const express = require("express");

const router = express.Router();
const contacts = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  const contactsList = await contacts.listContacts();
  res.json(contactsList);
  next();
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await contacts.getContactById(id);
  if (contact) {
    return res.json(contact);
  }
  next();
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name field" });
  }
  const newContact = await contacts.addContact(name, email, phone);
  return res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  if (id !== contacts.id) {
    return res.status(404).json({ message: "Not found" });
  }
  const newContacts = await contacts.removeContact(id);
  res.json(newContacts);

  next();
});

router.put("/:contactId", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing fields" });
  }
  const newContact = await contacts.addContact(name, email, phone);
  if (newContact) {
    return res.status(200).json(newContact);
  }
  return res.status(404).json({ message: "Not found" });
});

module.exports = router;
