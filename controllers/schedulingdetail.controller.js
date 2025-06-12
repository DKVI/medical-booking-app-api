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
  markAsDone: async (req, res) => {
    try {
      const id = req.params.id;
      await SchedulingDetail.markAsDone(id);
      return res.status(200).json({
        success: true,
        messsage: `mark as done successfully!`,
      });
    } catch (err) {
      return res.status(500).json({
        success: true,
        messsage: `mark as done failure!`,
      });
    }
  },
  markAsInprocess: async (req, res) => {
    try {
      console.log(req);
      const id = req.params.id;
      console.log(id);
      await SchedulingDetail.markAsInprocess(id);
      return res.status(200).json({
        success: true,
        messsage: `mark as in process successfully!`,
      });
    } catch (err) {
      return res.status(500).json({
        success: true,
        messsage: `mark as in process done failure!`,
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
  checkExpired: async (req, res) => {
    try {
      const result = await SchedulingDetail.checkExpired(
        req.params.id,
        req.body
      );
      return res.status(200).json({ success: true, status: result });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
};

module.exports = SchedulingDetailController;
