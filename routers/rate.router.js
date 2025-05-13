const express = require("express");
const rateController = require("../controllers/rate.controller");
const router = express.Router();

router.get("/:id", rateController.getByDoctorId);
router.get("/aver/:id", rateController.getAverRateByDoctorId);
router.get("/", rateController.getAll);
router.post("/", rateController.create);
router.get("/scheduling/:id", rateController.getBySchedulingId);
module.exports = router;
