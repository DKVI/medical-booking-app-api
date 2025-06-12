const Doctor = require("../models/doctor.model");
const UserModel = require("../models/user.model");
const doctorController = {
  // Lấy danh sách tất cả các bác sĩ
  getAll: async (req, res) => {
    try {
      var result = null;
      if (req.query.specialtyId) {
        result = await Doctor.getBySpecialtyId(req.query.specialtyId);
      } else {
        result = await Doctor.getAll(req.query?.keyword);
      }
      res.status(200).json({ success: true, doctors: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lấy danh sách bác sĩ theo facilityId và specialtyId
  getByFacilityIdAndSpecialtyId: async (req, res) => {
    try {
      const { facilityId, specialtyId } = req.query; // Lấy facilityId và specialtyId từ query params
      const result = await Doctor.getByFacilityIdAndSpecialtyId(
        facilityId,
        specialtyId
      );
      if (result.length == 0) {
        return res.status(404).json({ success: false, message: "not found" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lấy thông tin chi tiết của một bác sĩ theo ID
  getById: async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID từ URL params
      const result = await Doctor.getById(id);
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: "not found" });
      }
      res.status(200).json({ success: true, doctor: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Tạo mới một bác sĩ
  create: async (req, res) => {
    try {
      const { userId, specialty, facilityId } = req.body; // Lấy thông tin từ body request
      const result = await Doctor.create(userId, specialty, facilityId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Cập nhật thông tin của một bác sĩ

  // Xóa một bác sĩ theo ID
  delete: async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID từ URL params
      const result = await Doctor.delete(id);
      if (!result.success) {
        return res.status(404).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getTotalPatients: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Doctor.getTotalPatients(id);
      const totalPatients = result.total_patients;
      return res
        .status(200)
        .json({ success: true, total_patients: totalPatients });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  getTotalAppointmentToday: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Doctor.getTotalAppointmentToday(id);
      const totalAppointmentToday = result.total_appointments_today;
      return res.status(200).json({
        success: true,
        total_appointments_today: totalAppointmentToday,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  getTotalAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Doctor.getTotalAppointment(id);
      const totalAppointments = result.total_appointments;
      return res.status(200).json({
        success: true,
        total_appointments: totalAppointments,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  getAppointmentToday: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Doctor.getAppointmentToday(id);
      return res.status(200).json({
        success: true,
        appointments: result,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  getAllAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Doctor.getAllAppointment(id);
      return res.status(200).json({
        success: true,
        appointments: result,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  getAppointmentById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Doctor.getAppointmentById(id);
      return res.status(200).json({
        success: true,
        appointment: result,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  updateDoctorInfo: async (req, res) => {
    try {
      const { id } = req.params; // id là doctorId
      const updateData = req.body; // các trường cần update: fullname, dob, email, identity_no, phone_no, gender, avatar

      const result = await Doctor.updateDoctorInfo(id, updateData);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found or no changes made",
        });
      }

      res
        .status(200)
        .json({ success: true, message: "Doctor info updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  updateDoctorFullInfo: async (req, res) => {
    try {
      const { id } = req.params; // id là doctorId
      const updateData = req.body; // các trường cần update: fullname, dob, email, identity_no, phone_no, gender, avatar

      const result = await Doctor.updateDoctorFullInfo(id, updateData);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found or no changes made",
        });
      }

      res
        .status(200)
        .json({ success: true, message: "Doctor info updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  changeAvatar: async (req, res) => {
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
};

module.exports = doctorController;
