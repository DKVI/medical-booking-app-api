const workScheduleController = require("../controllers/workschedule.controller");
const express = require("express");
const router = express.Router();

router.get("/", workScheduleController.getAll);

module.exports = router;
