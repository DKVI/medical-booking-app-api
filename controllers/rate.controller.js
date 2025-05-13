const Rate = require("../models/rate.model");

const rateController = {
  getByDoctorId: async (req, res) => {
    try {
      const result = await Rate.getByDoctorId(req.params.id);
      return res.status(200).json({ success: true, rates: result });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },

  getAverRateByDoctorId: async (req, res) => {
    try {
      const average = await Rate.getAverRateByDoctorId(req.params.id);
      return res.status(200).json({
        success: true,
        doctorId: Number.parseInt(req.params.id),
        average: Number.parseFloat(average),
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },

  getAll: async (req, res) => {
    try {
      const rates = await Rate.getAll();
      const data = rates.map((rate) => {
        return {
          doctorId: Number.parseInt(rate.doctor_id),
          average: Number.parseFloat(rate.average_rate),
        };
      });
      return res.status(200).json({ success: true, rates: data });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
  getBySchedulingId: async (req, res) => {
    try {
      const result = await Rate.getBySchedulingId(req.params.id);
      return res.status(200).json({ success: true, rate: result[0] });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },

  create: async (req, res) => {
    try {
      const { doctor_id, patient_id, star_no, comments, date } = req.body;
      if (!doctor_id || !patient_id || !star_no || !comments || !date) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields!" });
      }

      const newRateId = await Rate.create({
        doctor_id,
        patient_id,
        star_no,
        comments,
        date,
      });
      return res.status(201).json({
        success: true,
        message: "Rate created successfully!",
        rateId: newRateId,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some error!" });
    }
  },
};

module.exports = rateController;
