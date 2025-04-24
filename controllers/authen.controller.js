const User = require("../models/user.model");

const userController = {
  createAccount: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const newAccount = await User.createAccount(username, password, email);
      res.status(200).json(newAccount);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server got some error, please try again!",
      });
    }
  },

  activeAccount: async (req, res) => {
    try {
      const token = req.params.token;

      const result = await User.activeAccount(token);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      res.redirect("http://localhost:5173/dashboard");
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await User.login(username, password);
      if (!result.success) {
        res.status(401).json({ message: result.message });
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  verify: async (req, res) => {
    try {
      const token = req.params.token;

      const result = await User.verify(token);

      if (!result.success) {
        return res
          .status(401)
          .json({ success: false, message: result.message });
      }

      res.status(200).json({ success: true, message: result.message });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  getByToken: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header Authorization

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Token is missing" });
      }

      const result = await User.verify(token); // Gọi phương thức verify từ model User

      if (!result.success) {
        return res
          .status(401)
          .json({ success: false, message: result.message });
      }

      res.status(200).json({ success: true, user: result.user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = userController;
