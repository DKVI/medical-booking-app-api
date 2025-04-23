const Facility = require("../models/facility.model");

const facilityController = {
  // Tạo mới một facility
  create: async (req, res) => {
    try {
      const { name, address } = req.body;
      const result = await Facility.create(name, address);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lấy danh sách tất cả các facility
  getAll: async (req, res) => {
    try {
      const result = await Facility.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lấy thông tin chi tiết của một facility theo ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Facility.getById(id);
      if (!result.success) {
        return res.status(404).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Cập nhật thông tin của một facility
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address } = req.body;
      const result = await Facility.update(id, name, address);
      if (!result.success) {
        return res.status(404).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Xóa một facility theo ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Facility.delete(id);
      if (!result.success) {
        return res.status(404).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = facilityController;
