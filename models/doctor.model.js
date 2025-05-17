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
  getDoctorByUsername: async (username) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = `
        SELECT 
          u.fullname, 
          u.email, 
          u.phone_no, 
          u.username, 
          u.gender, 
          u.avatar, 
          u.identity_no, 
          u.id AS user_id, 
          dt.id AS doctor_id, 
          f.name AS facility_name, 
          s.name AS specialty_name
        FROM user AS u 
        INNER JOIN doctor AS dt ON u.id = dt.user_id 
        INNER JOIN facility AS f ON dt.facility_id = f.id 
        INNER JOIN specialty AS s ON dt.specialty_id = s.id
        WHERE u.username = ?
      `;
        const [result] = await conn.query(sql, [username]);
        resolve(result[0]);
      } catch (err) {
        reject(err);
      }
    });
  },
  getTotalPatients: async (id) => {
    try {
      const sql = `SELECT COUNT(*) as total_patients 
                    FROM scheduling_detail as sd 
                      WHERE doctor_id = ? AND sd.status = "Done"`;
      const [result] = await conn.query(sql, [id]);
      return result[0];
    } catch (err) {
      throw err;
    }
  },
  getTotalAppointmentToday: async (id) => {
    try {
      const sql = `SELECT COUNT(*) AS total_appointments_today
                    FROM scheduling_detail AS sd
                      INNER JOIN purchase AS p ON p.scheduling_details_id = sd.id
                        WHERE sd.doctor_id = ? AND sd.date = CURDATE();`;
      const [result] = await conn.query(sql, [id]);
      return result[0];
    } catch (err) {
      throw err;
    }
  },

  // getTotalAppointment: async (id) => {
  //   try {
  //     const sql = ``
  //   }
  // }
};

module.exports = Doctor;
