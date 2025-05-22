const express = require("express");
const doctorController = require("../controllers/doctor.controller");

const router = express.Router();

// Định nghĩa các route cho doctor
router.get("/", doctorController.getAll);
router.get("/filter", doctorController.getByFacilityIdAndSpecialtyId);
router.get("/:id", doctorController.getById);
router.post("/", doctorController.create);
router.put("/:id", doctorController.update);
router.delete("/:id", doctorController.delete);
router.get("/total-patients/:id", doctorController.getTotalPatients);
router.get(
  "/total-appointments-today/:id",
  doctorController.getTotalAppointmentToday
);

router.get("/total-appointments/:id", doctorController.getTotalAppointment);
router.get("/appointments-today/:id", doctorController.getAppointmentToday);
router.get("/appointments/:id", doctorController.getAllAppointment);
router.get("/appointments/detail/:id", doctorController.getAppointmentById);
module.exports = router;
