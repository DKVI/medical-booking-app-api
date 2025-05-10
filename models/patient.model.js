const conn = require("../db");

const PatientModel = {
  getAll: async () => {
    try {
      const sql =
        "SELECT *, p.id AS patient_id, u.id AS user_id FROM patient AS p INNER JOIN user AS u ON p.user_id = u.id";
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const sql =
        "SELECT *, p.id AS patient_id, u.id AS user_id FROM patient AS p INNER JOIN user AS u ON p.user_id = u.id WHERE p.id = ?";
      const [result] = await conn.query(sql, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  
};

module.exports = PatientModel;
