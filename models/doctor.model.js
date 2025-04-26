const conn = require("../db");

const Doctor = {
  getAll: async (keyword) => {
    return new Promise(async (resolve, reject) => {
      try {
        let sql;
        let params = [];

        if (keyword) {
          // Nếu có keyword, tìm kiếm theo keyword
          sql = `
          SELECT * 
          FROM user 
          INNER JOIN doctor ON user.id = doctor.user_id
          WHERE user.fullname LIKE ?
        `;
          const searchKeyword = `%${keyword}%`;
          params = [searchKeyword, searchKeyword, searchKeyword];
        } else {
          // Nếu không có keyword, lấy tất cả bác sĩ
          sql = `
          SELECT * 
          FROM user 
          INNER JOIN doctor ON user.id = doctor.user_id
        `;
        }

        const [result] = await conn.query(sql, params);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },

  getByFacilityIdAndSpecialtyId: async (facilityId, specialtyId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql =
          "SELECT *, dt.id AS `doctorId`  FROM user INNER JOIN doctor AS dt ON user.id = dt.user_id WHERE facility_id = ? AND specialty_id = ?";
        const [result] = await conn.query(sql, [facilityId, specialtyId]);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
  getById: async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql =
          "SELECT *, dt.id AS `doctorId`  FROM user INNER JOIN doctor AS dt ON user.id = dt.user_id WHERE dt.id = ?";
        const [result] = await conn.query(sql, [id]);
        resolve(result[0]);
      } catch (err) {
        reject(err);
      }
    });
  },
  getBySpecialtyId: (specialtyId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `
        SELECT 
          u.*, 
          d.id AS doctorId, 
          d.specialty_id, 
          d.facility_id 
        FROM user AS u
        INNER JOIN doctor AS d ON u.id = d.user_id
        WHERE d.specialty_id = ?
      `;
        const [results] = await conn.query(sql, [specialtyId]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
};

module.exports = Doctor;
