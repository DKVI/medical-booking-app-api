const conn = require("../db");

const Rate = {
  getByDoctorId: async (id) => {
    try {
      const sql =
        "SELECT r.id, u.avatar, r.comments, r.date, r.star_no, u.fullname FROM rate AS r INNER JOIN patient AS p ON r.patient_id = p.id INNER JOIN user AS u ON u.id = p.user_id WHERE doctor_id = ?";
      const [result] = await conn.query(sql, [id]);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getAverRateByDoctorId: async (id) => {
    try {
      const sql =
        "SELECT AVG(r.star_no) AS average_rate FROM rate AS r WHERE r.doctor_id = ?";
      const [result] = await conn.query(sql, [id]);
      return result[0]?.average_rate || 0;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getAll: async () => {
    try {
      const sql = `
        SELECT r.doctor_id, AVG(r.star_no) AS average_rate
        FROM rate AS r
        GROUP BY r.doctor_id
      `;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

module.exports = Rate;
