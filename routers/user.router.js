const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/", userController.getAll);
router.post("/", userController.create);
router.delete("/:id", userController.deleteById);
router.put("/:id", userController.updateById);
module.exports = router;
