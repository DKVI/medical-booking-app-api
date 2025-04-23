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
};

module.exports = Workschedule;
