const Statistics = require("../models/statistics.model");

const statisticsController = {
  getStatisticsAppoinmentByDoctorId: async (req, res) => {
    try {
      const { id, year } = req.body;
      const result = await Statistics.getStatisticsAppoinmentByDoctorId(
        id,
        year
      );
      return res
        .status(200)
        .json({ success: true, doctor_id: id, year, statistics: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  totalRevenue: async (req, res) => {
    try {
      const result = await Statistics.totalRevenue();
      return res.status(200).json({ success: true, total: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  totalDoctor: async (req, res) => {
    try {
      const result = await Statistics.totalDoctor();
      return res.status(200).json({ success: true, total: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  totalFacility: async (req, res) => {
    try {
      const result = await Statistics.totalFacility();
      return res.status(200).json({ success: true, total: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  totalUser: async (req, res) => {
    try {
      const result = await Statistics.totalUser();
      return res.status(200).json({ success: true, total: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  revenuePerDoctorList: async (req, res) => {
    try {
      const result = await Statistics.revenuePerDoctorList();
      return res.status(200).json({ success: true, total: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  revenuePerDoctorListByFacilityId: async (req, res) => {
    try {
      const result = await Statistics.revenuePerDoctorByFacilityId(
        req.params.id
      );
      return res.status(200).json({ success: true, total: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  revenuePerFacility: async (req, res) => {
    try {
      const result = await Statistics.revenuePerFacility();
      return res.status(200).json({ success: true, total: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  rateAppointments: async (req, res) => {
    try {
      const result = await Statistics.rateAppointments();
      return res.status(200).json({ success: true, rate: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  appointmentsPerMonth: async (req, res) => {
    try {
      const result = await Statistics.appointmentsPerMonth();
      return res.status(200).json({ success: true, data: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
};

module.exports = statisticsController;
