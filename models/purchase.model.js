const conn = require("../db");

const PurchaseModel = {
  confirmPurchase: async (schedulingDetailId) => {
    try {
      const sql = `UPDATE purchase as p SET p.status = "Purchased" WHERE p.scheduling_details_id = ?`;
      const [result] = await conn.query(sql, [schedulingDetailId]);
      return result;
    } catch (err) {
      throw err;
    }
  },
  getPurchase: async (schedulingDetailId) => {
    try {
      const sql =
        "SELECT * FROM purchase AS p WHERE p.scheduling_details_id = ?";
      const [result] = await conn.query(sql, [schedulingDetailId]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = PurchaseModel;
