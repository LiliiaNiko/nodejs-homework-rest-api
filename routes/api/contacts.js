const express = require("express");
const contactController = require("../../controllers/contacts.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { auth } = require("../../middlewares/auth");

const router = express.Router();

router.get(
  "/",
  tryCatchWrapper(auth),
  tryCatchWrapper(contactController.getAll)
);
router.get(
  "/:id",
  tryCatchWrapper(auth),
  tryCatchWrapper(contactController.findOneById)
);
router.post(
  "/",
  tryCatchWrapper(auth),
  tryCatchWrapper(contactController.create)
);
router.delete(
  "/:id",
  tryCatchWrapper(auth),
  tryCatchWrapper(contactController.deleteById)
);
router.put(
  "/:id",
  tryCatchWrapper(auth),
  tryCatchWrapper(contactController.updateById)
);
router.patch(
  "/:id/favorite",
  tryCatchWrapper(auth),
  tryCatchWrapper(contactController.updateStatusContact)
);

module.exports = router;
