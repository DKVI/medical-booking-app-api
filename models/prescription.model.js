const conn = require("../db");

const Prescription = {
  getBySchedulingId: async (id) => {
    try {
      const sql = `SELECT pm.prescription_id, pm.quantity AS quantity, m.name, m.dosage, p.notes
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
  createPrescription: async (appointment_id, body) => {
    const { notes, medicines } = body;
    try {
      const sql =
        "INSERT INTO prescription (notes, scheduling_detail_id) VALUES (?,?)";
      await conn.query(sql, [notes, appointment_id]);
      const sql2 = "SELECT * FROM prescription WHERE scheduling_detail_id = ?";
      const [result] = await conn.query(sql2, [appointment_id]);
      console.log(result[0]);
      Array.from(medicines).forEach(async (item) => {
        let sql =
          "INSERT INTO prescription_medicine (prescription_id, medicine_id, quantity) VALUES (?,?,?)";
        try {
          await conn.query(sql, [result[0].id, item.id, item.quantity]);
        } catch (err) {
          throw err;
        }
      });
      return result.id;
    } catch (err) {
      throw err;
    }
  },
  deleteById: async (id) => {
    try {
      // Xóa các bản ghi liên quan trong prescription_medicine trước
      await conn.query(
        "DELETE FROM prescription_medicine WHERE prescription_id = ?",
        [id]
      );
      // Sau đó xóa prescription
      const [result] = await conn.query(
        "DELETE FROM prescription WHERE id = ?",
        [id]
      );
      return { success: result.affectedRows > 0 };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

module.exports = Prescription;
