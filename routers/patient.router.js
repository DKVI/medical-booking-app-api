const express = require("express");
const patientController = require("../controllers/patient.controller");

const router = express.Router();

router.get("/", patientController.getAll);
router.get("/:id", patientController.getById);

module.exports = router;
