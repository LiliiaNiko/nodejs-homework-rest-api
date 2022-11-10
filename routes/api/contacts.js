const express = require("express");
const contactController = require("../../controllers/contacts.controller");
const { tryCatchWrapper } = require("../../helpers/index");

const router = express.Router();

router.get("/", tryCatchWrapper(contactController.getAll));
router.get("/:id", tryCatchWrapper(contactController.findOneById));
router.post("/", tryCatchWrapper(contactController.create));
router.delete("/:id", tryCatchWrapper(contactController.deleteById));
router.put("/:id", tryCatchWrapper(contactController.updateById));
router.patch(
  "/:id/favorite",
  tryCatchWrapper(contactController.updateStatusContact)
);

module.exports = router;
