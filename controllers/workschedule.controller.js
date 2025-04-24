const Workschedule = require("../models/workschedule.model");

const workSchedule = {
  getAll: async (req, res) => {
    try {
      const result = await Workschedule.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Workschedule.getById(id);
      if (result.length === 0) {
        res.status(404).json({ success: false, message: "not found!" });
      }
      res.status(200).json({ success: true, workSchedule: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = workSchedule;
