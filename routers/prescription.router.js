const express = require("express");
const prescriptionController = require("../controllers/prescription.controller");
const router = express.Router();

router.get("/scheduling/:id", prescriptionController.getBySchedulingId);
router.post("/:id", prescriptionController.createPrescription);
router.delete("/:id", prescriptionController.deleteById);
module.exports = router;
