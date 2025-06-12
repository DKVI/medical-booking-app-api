const express = require("express");
const statisticsController = require("../controllers/statistics.controller");
const router = express.Router();

router.post(
  "/doctor_appointment",
  statisticsController.getStatisticsAppoinmentByDoctorId
);
router.get("/total_revenue", statisticsController.totalRevenue);
router.get("/total_doctor", statisticsController.totalDoctor);
router.get("/total_facility", statisticsController.totalFacility);
router.get("/total_user", statisticsController.totalUser);
router.get("/revenue_per_doctor", statisticsController.revenuePerDoctorList);
router.get("/revenue_per_facility", statisticsController.revenuePerFacility);
router.get("/rate_appointments", statisticsController.rateAppointments);
router.get(
  "/appointments_per_month",
  statisticsController.appointmentsPerMonth
);
module.exports = router;
