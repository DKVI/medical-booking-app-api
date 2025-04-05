const express = require("express");
const TestController = require("../controllers/test.controller");
const router = express.Router();

router.get("/", TestController.getAllTests);

router.get("/:id", TestController.getTestById);

router.post("/", TestController.createTest);

router.put("/:id", TestController.updateTest);

router.delete("/:id", TestController.deleteTest);

module.exports = router;
