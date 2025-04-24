const conn = require("../db");

const SchedulingDetail = {
  create: async (body) => {
    try {
      const status = "Process";
      const sql = `
        INSERT INTO scheduling_detail (id, doctor_id, patient_id, workschedule_id, date, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      console.log(body);
      const [result] = await conn.query(sql, [
        body.id,
        body.doctor_id,
        body.patient_id,
        body.workschedule_id,
        body.date,
        status,
      ]);
      const sqlPurchase =
        "INSERT INTO purchase (scheduling_details_id, status, total) VALUES (?, ?, ?)";
      const [resultPurchase] = await conn.query(sqlPurchase, [
        body.id,
        "Pending",
        0.5,
      ]);
      return body.id;
    } catch (err) {
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const sql = "SELECT * FROM scheduling_detail WHERE id = ?";
      const [result] = await conn.query(sql, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = SchedulingDetail;
