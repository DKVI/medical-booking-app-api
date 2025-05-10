const Prescription = require("../models/prescription.model");

const prescriptionController = {
  getBySchedulingId: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Prescription.getBySchedulingId(id);
      if (result.length !== 0) {
        return res
          .status(200)
          .json({ success: true, notes: result[0].notes, medicines: result });
      } else {
        return res  
          .status(404)
          .json({ success: false, message: "Not found any medicines" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server got some err!" });
    }
  },
};

module.exports = prescriptionController;
