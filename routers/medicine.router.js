const express = require("express");
const medicineController = require("../controllers/medicine.controller");

const router = express.Router();

router.get("/", medicineController.getAll);

module.exports = router;
