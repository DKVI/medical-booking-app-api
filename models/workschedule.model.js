const conn = require("../db");

const Workschedule = {
  getAll: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "Select * from workschedule";
        const [result] = await conn.query(sql);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
  getById: async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "Select * from workschedule where id = ?";
        const [result] = await conn.query(sql, [id]);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
};

module.exports = Workschedule;
