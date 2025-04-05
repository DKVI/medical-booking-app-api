const Test = require("../models/test.model");

const TestController = {
  getAllTests: async (req, res) => {
    try {
      const tests = await Test.getAll();
      res.status(200).json(tests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getTestById: async (req, res) => {
    try {
      const test = await Test.getById(req.params.id);
      res.status(200).json(test);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTest: async (req, res) => {
    try {
      const createdTest = await Test.add(req.body);
      res.status(201).json(createdTest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateTest: async (req, res) => {
    try {
      const updatedTest = await Test.update(req.params.id, req.body);
      res.status(200).json(updatedTest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteTest: async (req, res) => {
    try {
      await Test.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TestController;
