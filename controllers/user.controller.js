const User = require("../models/user.model");

const userController = {
  getAll: async (req, res) => {
    try {
      const result = await User.getALL();
      return res.status(200).json({ success: true, users: result });
    } catch (err) {
      return res.status(500).json({ success: true, message: err });
    }
  },
  create: async (req, res) => {
    try {
      const {
        username,
        password,
        fullname,
        identity_no,
        phone_no,
        email,
        role,
        status,
        gender,
        avatar,
        dob,
        address,
      } = req.body;

      // Gọi model để tạo user mới
      const result = await User.create({
        username,
        password,
        fullname,
        identity_no,
        phone_no,
        email,
        role,
        status,
        gender,
        avatar,
        dob,
        address,
      });

      return res.status(201).json({ success: true, result });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  deleteById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await User.deleteById(id);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  updateById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await User.updateById(id, req.body);
      if (!result.success) {
        return res.status(404).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = userController;
