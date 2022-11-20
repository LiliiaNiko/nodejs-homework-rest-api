const express = require("express");
const usersController = require("../../controllers/users.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { auth } = require("../../middlewares/auth");

const usersRouter = express.Router();

usersRouter.get(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(usersController.getContacts)
);
usersRouter.post(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(usersController.createContact)
);

module.exports = usersRouter;
