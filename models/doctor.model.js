const conn = require("../db");

const Doctor = {
  getAll: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql =
          "SELECT * FROM user INNER JOIN doctor ON user.id = doctor.user_id";
        const [result] = await conn.query(sql);
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
};

module.exports = Doctor;
