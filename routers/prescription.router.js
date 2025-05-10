const express = require("express");
const prescriptionController = require("../controllers/prescription.controller");
const router = express.Router();

router.get("/scheduling/:id", prescriptionController.getBySchedulingId);

module.exports = router;
