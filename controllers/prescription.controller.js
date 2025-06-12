const Prescription = require("../models/prescription.model");

const prescriptionController = {
  getBySchedulingId: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Prescription.getBySchedulingId(id);
      if (result.length !== 0) {
        return res
          .status(200)
          .json({
            success: true,
            id: result[0].prescription_id,
            notes: result[0].notes,
            medicines: result,
          });
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
  createPrescription: async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const result = await Prescription.createPrescription(id, body);
      return res.status(200).json({ success: true, prescription: result });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  deleteById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Prescription.deleteById(id);
      if (result.success) {
        return res
          .status(200)
          .json({ success: true, message: "Deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Prescription not found" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = prescriptionController;
