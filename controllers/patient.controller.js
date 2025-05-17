const PatientModel = require("../models/patient.model");
const UserModel = require("../models/user.model");
const uploadAvatar = require("./upload.controller");
const patientController = {
  // Lấy danh sách tất cả bệnh nhân
  getAll: async (req, res) => {
    try {
      const result = await PatientModel.getAll(); // Gọi model để lấy danh sách bệnh nhân
      res.status(200).json({ success: true, patients: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lấy thông tin chi tiết của một bệnh nhân theo ID
  getById: async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID từ URL params
      const result = await PatientModel.getById(id); // Gọi model để lấy thông tin bệnh nhân theo ID
      if (result.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }
      res.status(200).json({ success: true, patient: result[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const patientData = req.body; // Lấy dữ liệu cập nhật từ body request

      const result = await UserModel.updatePatientInfo(patientData); // Gọi model để cập nhật thông tin bệnh nhân

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Patient not found or no changes made",
        });
      }

      res
        .status(200)
        .json({ success: true, message: "Patient updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  changeAvt: async (req, res) => {
    try {
      const { id, avatar } = req.body;
      const result = await UserModel.changeAvatar(id, avatar);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Doesn't have any user",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Update avatar successfully",
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  uploadAvatar: uploadAvatar,
};

module.exports = patientController;
