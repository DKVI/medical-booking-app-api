const Specialty = require("../models/specialty.model");

const SpecialtyController = {
  getAllSpecialties: async (req, res) => {
    try {
      const specialties = await Specialty.getAll();
      res.status(200).json({ success: true, specialties });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSpecialtyById: async (req, res) => {
    try {
      const specialty = await Specialty.getById(req.params.id);
      if (specialty.length === 0) {
        return res.status(404).json({ message: "Specialty not found" });
      }
      res.status(200).json({ success: true, specialty: specialty[0] });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createSpecialty: async (req, res) => {
    try {
      const newSpecialty = await Specialty.add(req.body);
      console.log(req);
      res.status(201).json({
        message: "Specialty created successfully",
        id: newSpecialty.insertId,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateSpecialty: async (req, res) => {
    try {
      const updatedSpecialty = await Specialty.update(req.params.id, req.body);
      if (updatedSpecialty.affectedRows === 0) {
        return res.status(404).json({ message: "Specialty not found" });
      }
      res.status(200).json({ message: "Specialty updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteSpecialty: async (req, res) => {
    try {
      const deletedSpecialty = await Specialty.delete(req.params.id);
      if (deletedSpecialty.affectedRows === 0) {
        return res.status(404).json({ message: "Specialty not found" });
      }
      res.status(200).json({ message: "Specialty deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = SpecialtyController;
