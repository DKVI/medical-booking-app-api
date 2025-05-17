const SchedulingDetail = require("../models/schedulingdetail.model"); // điều chỉnh đường dẫn nếu khác

const SchedulingDetailController = {
  create: async (req, res) => {
    try {
      const id = await SchedulingDetail.create(req.body);
      return res.status(200).json({
        success: true,
        id,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  },
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await SchedulingDetail.getById(id);
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "not found",
        });
      }
      return res.status(200).json({
        success: true,
        schedulingDetail: result,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const result = await SchedulingDetail.getAll();
      if (result.length !== 0) {
        return res
          .status(200)
          .json({ success: true, schedulingDetails: result });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Not found any data" });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  getByPatientId: async (req, res) => {
    try {
      console.log(req.params.id);
      const result = await SchedulingDetail.getByPatientId(req.params.id);
      if (result.length !== 0) {
        return res
          .status(200)
          .json({ success: true, schedulingDetails: result });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Not found any data" });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
};

module.exports = SchedulingDetailController;
