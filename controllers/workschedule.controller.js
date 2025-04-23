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
};

module.exports = workSchedule;
