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
};

module.exports = userController;
