const express = require("express");
const router = express.Router();
const SchedulingDetailController = require("../controllers/schedulingdetail.controller");

router.post("/", SchedulingDetailController.create);
router.get("/", SchedulingDetailController.getAll);
router.get("/:id", SchedulingDetailController.getById);
router.get("/patient/:id", SchedulingDetailController.getByPatientId);
module.exports = router;
