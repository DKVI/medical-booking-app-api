const Medicince = require("../models/medicine.model");

const medicineController = {
  getAll: async (req, res) => {
    try {
      const result = await Medicince.getAll();
      return res.status(200).json({ success: true, medicines: result });
    } catch (err) {
      return res.status(500).json({ success: true, message: err });
    }
  },
};

module.exports = medicineController;
