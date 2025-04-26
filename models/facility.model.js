const conn = require("../db");

const Facility = {
  // Tạo mới một facility
  create: async (name, address) => {
    try {
      const sql = "INSERT INTO facility (name, address) VALUES (?, ?)";
      const [result] = await conn.query(sql, [name, address]);
      return {
        success: true,
        id: result.insertId,
        message: "Facility created successfully",
      };
    } catch (error) {
      console.error("Error creating facility:", error.message);
      throw error;
    }
  },

  // Lấy danh sách tất cả các facility
  getAll: async () => {
    try {
      const sql = "SELECT * FROM facility";
      const [rows] = await conn.query(sql);
      return { success: true, facilities: rows };
    } catch (error) {
      console.error("Error fetching facilities:", error.message);
      throw error;
    }
  },

  // Lấy thông tin chi tiết của một facility theo ID
  getById: async (id) => {
    try {
      const sql = "SELECT * FROM facility WHERE id = ?";
      const [rows] = await conn.query(sql, [id]);
      if (rows.length === 0) {
        return { success: false, message: "Facility not found" };
      }
      return { success: true, facility: rows[0] };
    } catch (error) {
      console.error("Error fetching facility:", error.message);
      throw error;
    }
  },

  // Cập nhật thông tin của một facility
  update: async (id, name, address) => {
    try {
      const sql = "UPDATE facility SET name = ?, address = ? WHERE id = ?";
      const [result] = await conn.query(sql, [name, address, id]);
      if (result.affectedRows === 0) {
        return {
          success: false,
          message: "Facility not found or no changes made",
        };
      }
      return { success: true, message: "Facility updated successfully" };
    } catch (error) {
      console.error("Error updating facility:", error.message);
      throw error;
    }
  },

  // Xóa một facility theo ID
  delete: async (id) => {
    try {
      const sql = "DELETE FROM facility WHERE id = ?";
      const [result] = await conn.query(sql, [id]);
      if (result.affectedRows === 0) {
        return { success: false, message: "Facility not found" };
      }
      return { success: true, message: "Facility deleted successfully" };
    } catch (error) {
      console.error("Error deleting facility:", error.message);
      throw error;
    }
  },
  getByDoctorId: async (doctorId) => {
    try {
      const sql = `
      SELECT f.* 
      FROM facility AS f
      INNER JOIN doctor AS d ON f.id = d.facility_id
      WHERE d.id = ?
    `;
      const [rows] = await conn.query(sql, [doctorId]);
      if (rows.length === 0) {
        return {
          success: false,
          message: "Facility not found for the given doctor",
        };
      }
      return { success: true, facility: rows[0] };
    } catch (error) {
      console.error("Error fetching facility by doctor ID:", error.message);
      throw error;
    }
  },
};

module.exports = Facility;
