const express = require("express");
const router = express.Router();
const SchedulingDetailController = require("../controllers/schedulingdetail.controller");

router.post("/", SchedulingDetailController.create);
router.get("/", SchedulingDetailController.getAll);
router.get("/:id", SchedulingDetailController.getById);
router.put("/mark-as-done/:id", SchedulingDetailController.markAsDone);
router.put(
  "/mark-as-inprocess/:id",
  SchedulingDetailController.markAsInprocess
);
router.get("/patient/:id", SchedulingDetailController.getByPatientId);
router.post("/check-expired/:id", SchedulingDetailController.checkExpired);
module.exports = router;
