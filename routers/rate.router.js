const express = require("express");
const rateController = require("../controllers/rate.controller");
const router = express.Router();

router.get("/:id", rateController.getByDoctorId);
router.get("/aver/:id", rateController.getAverRateByDoctorId);
router.get("/", rateController.getAll);
module.exports = router;
