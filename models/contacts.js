const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const Joi = require("joi");

const contactsPath = path.resolve("./models/contacts.json");

async function listContacts() {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);
  return contacts;
}

async function getContactById(contactId) {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);
  const contact = contacts.find((item) => item.id === contactId);
  return contact;
}

const removeContact = async (contactId) => {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);
  const newContacts = contacts.filter((item) => item.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  console.table(newContacts);
};

const addContact = async (name, email, phone) => {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);
  const id = nanoid();
  const schema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required(),
    phone: Joi.number().required(),
  });
  schema.validate({ name, email, phone });

  const newContact = { id, name, email, phone };
  contacts.push(newContact);
  console.table(contacts);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, name, email, phone) => {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);
  const schema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required(),
    phone: Joi.number().required(),
  });
  schema.validate({ contactId, name, email, phone });
  const contact = contacts.find((contact) => contact.id === contactId);
  contact.name = name;
  contact.email = email;
  contact.phone = phone;
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
