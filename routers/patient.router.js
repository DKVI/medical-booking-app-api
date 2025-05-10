const express = require("express");
const patientController = require("../controllers/patient.controller");
const router = express.Router();

router.get("/", patientController.getAll);
router.get("/:id", patientController.getById);
router.post("/", patientController.update);
router.post("/changeAvt", patientController.changeAvt);
module.exports = router;
