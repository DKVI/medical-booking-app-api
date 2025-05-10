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

  getAll: async () => {
    try {
      const sql = `SELECT 
        sd.id,
        sd.date,
        ws.times,
        u.fullname AS doctor_name,
        f.name AS facility_name,
        sd.doctor_id, 
        sp.name AS "specialty_name",
		  d.facility_id,
      sd.status,
		  sp.id AS "specialty_id"
      FROM scheduling_detail AS sd
      INNER JOIN workschedule AS ws ON sd.workschedule_id = ws.id
      INNER JOIN doctor AS d ON sd.doctor_id = d.id
      INNER JOIN user AS u ON d.user_id = u.id
      INNER JOIN facility AS f ON d.facility_id = f.id
      INNER JOIN specialty AS sp ON sp.id = d.specialty_id
      
      `;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = SchedulingDetail;
