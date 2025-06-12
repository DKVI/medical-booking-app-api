const conn = require("../db");

const Medicince = {
  getAll: async () => {
    try {
      console.log("hello");
      const sql = "SELECT * FROM medicine";
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Medicince;
