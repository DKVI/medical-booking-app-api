const conn = require("../db");

const Prescription = {
  getBySchedulingId: async (id) => {
    try {
      const sql = `SELECT pm.quantity AS quantity, m.name, m.dosage, p.notes
                            FROM prescription AS p
                                INNER JOIN prescription_medicine AS pm ON p.id = pm.prescription_id
                                    INNER JOIN medicine AS m ON pm.medicine_id = m.id
                                        WHERE scheduling_detail_id =?`;
      const [result] = await conn.query(sql, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Prescription;
