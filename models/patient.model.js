const conn = require("../db");
const { deleteById } = require("./user.model");

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

  getByUserId: async (user_id) => {
    try {
      const sql = `
        SELECT p.id as patient_id, p.insurance_no, p.weight, p.height
        FROM patient AS p
        WHERE p.user_id = ?
      `;
      const [result] = await conn.query(sql, [user_id]);
      return result[0] || null;
    } catch (err) {
      throw err;
    }
  },

  updateById: async ({ id, weight, height, insurance_no }) => {
    try {
      let result;
      await deleteById(id);
      if (insurance_no !== null) {
        sql =
          "UPDATE patient SET weight = ?, height = ?, insurance_no = ? WHERE id = ?";
        const insuranceNumber = insurance_no;
        result = await conn.query(sql, [weight, height, insuranceNumber, id]);
      } else {
        sql = "UPDATE patient SET weight = ?, height = ? WHERE id = ?";
        insuranceNumber = insurance_no;
        result = await conn.query(sql, [weight, height, id]);
      }
      return result;
    } catch (err) {
      throw err;
    }
  },
  createPatient: async ({ id, weight, height, insurance_no }) => {
    try {
      let result;
      await deleteById(id);
      if (insurance_no !== null) {
        sql =
          "INSERT INTO patient (user_id, weight, height, insurance_no) VALUES (?,?,?,?)";
        const insuranceNumber = insurance_no;
        result = await conn.query(sql, [
          user_id,
          weight,
          height,
          insuranceNumber,
        ]);
      } else {
        sql = "INSERT INTO patient (user_id, weight, height) VALUES (?,?,?)";
        insuranceNumber = insurance_no;
        result = await conn.query(sql, [id, weight, height]);
      }
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = PatientModel;
