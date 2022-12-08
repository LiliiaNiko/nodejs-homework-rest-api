const express = require("express");
const authController = require("../../controllers/auth.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { auth } = require("../../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", tryCatchWrapper(authController.register));
authRouter.post("/login", tryCatchWrapper(authController.login));
authRouter.get(
  "/verify/:verificationToken",
  tryCatchWrapper(authController.verifyEmail)
);
authRouter.post("/verify", tryCatchWrapper(authController.resendVerifyEmail));
authRouter.post(
  "/logout",
  tryCatchWrapper(auth),
  tryCatchWrapper(authController.logout)
);
authRouter.get(
  "/current",
  tryCatchWrapper(auth),
  tryCatchWrapper(authController.currentUser)
);

module.exports = authRouter;
