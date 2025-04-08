const User = require("../models/user.model");

const userController = {
  createAccount: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const newAccount = await User.createAccount(username, password, email);
      res.status(200).json(newAccount);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  activeAccount: async (req, res) => {
    try {
      const token = req.params.token;

      const result = await User.activeAccount(token);

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await User.login(username, password);
      if (!result.success) {
        res.status(401).json({ message: "username or password was wrong!" });
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userController;
