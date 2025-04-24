const workScheduleController = require("../controllers/workschedule.controller");
const express = require("express");
const router = express.Router();

router.get("/", workScheduleController.getAll);
router.get("/:id", workScheduleController.getById);
module.exports = router;
