const express = require("express");
const patientController = require("../controllers/patient.controller");
const router = express.Router();

router.get("/", patientController.getAll);
router.get("/:id", patientController.getById);
router.get("/user/:userId", patientController.getByUserId);
router.post("/", patientController.update);
router.post("/changeAvt", patientController.changeAvt);
router.post("/upload-avatar", patientController.uploadAvatar); // Thêm dòng này
router.put("/:id", patientController.updateById);
module.exports = router;
