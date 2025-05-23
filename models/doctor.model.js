const conn = require("../db");
const SchedulingDetail = require("./schedulingdetail.model");
const User = require("./user.model");

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
          u.dob,
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

  getTotalAppointment: async (id) => {
    try {
      const sql = `SELECT COUNT(*) AS total_appointments
                    FROM scheduling_detail AS sd
                      INNER JOIN purchase AS p ON p.scheduling_details_id = sd.id
                        WHERE sd.doctor_id = ? AND p.status = 'Purchased';`;

      const [result] = await conn.query(sql, [id]);
      return result[0];
    } catch (err) {
      throw err;
    }
  },
  getAppointmentToday: async (id) => {
    try {
      const sql = `SELECT sd.id, u.dob, p.weight, p.height, ws.times, u.email, u.fullname, u.username, u.phone_no, u.gender, u.avatar, sd.date, pc.status AS pucharse_status, sd.status AS scheduling_status
                    FROM scheduling_detail AS sd INNER JOIN purchase AS pc 
                      ON sd.id = pc.scheduling_details_id INNER JOIN patient AS p ON sd.patient_id = p.id
                        INNER JOIN user AS u ON u.id = p.user_id
                          INNER JOIN workschedule AS ws ON ws.id = sd.workschedule_id
                            WHERE sd.status = "Process" AND pc.status = "Purchased" AND sd.date = CURDATE() AND sd.doctor_id = ?`;
      const [result] = await conn.query(sql, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
  getAllAppointment: async (id) => {
    try {
      const sql = `SELECT sd.id, u.dob, p.weight, p.height, ws.times, u.email, u.fullname, u.username, u.phone_no, u.gender, u.avatar, sd.date, pc.status AS pucharse_status, sd.status AS scheduling_status
        FROM scheduling_detail AS sd INNER JOIN purchase AS pc 
          ON sd.id = pc.scheduling_details_id INNER JOIN patient AS p ON sd.patient_id = p.id
            INNER JOIN user AS u ON u.id = p.user_id
              INNER JOIN workschedule AS ws ON ws.id = sd.workschedule_id
                WHERE pc.status = "Purchased" AND sd.doctor_id = ?`;
      const [result] = await conn.query(sql, [id]);

      // Duyệt tuần tự, đảm bảo cập nhật xong hết trước khi lấy lại dữ liệu
      for (const item of result) {
        try {
          await SchedulingDetail.checkExpired(item.id, {
            date: item.date,
            times: item.times,
            status: item.scheduling_status,
          });
        } catch (err) {
          console.log(err);
        }
      }

      // Lấy lại dữ liệu đã cập nhật
      const [result2] = await conn.query(sql, [id]);
      return result2;
    } catch (err) {
      throw err;
    }
  },
  getAppointmentById: async (id) => {
    try {
      const sql = `SELECT sd.id, u.dob, p.weight, p.height, ws.times, u.email, u.fullname, u.username, u.phone_no, u.gender, u.avatar, sd.date, pc.status AS pucharse_status, sd.status AS scheduling_status
                    FROM scheduling_detail AS sd INNER JOIN purchase AS pc 
                      ON sd.id = pc.scheduling_details_id INNER JOIN patient AS p ON sd.patient_id = p.id
                        INNER JOIN user AS u ON u.id = p.user_id
                          INNER JOIN workschedule AS ws ON ws.id = sd.workschedule_id
                            WHERE pc.status = "Purchased" AND sd.id = ?`;
      const [result] = await conn.query(sql, [id]);
      return result[0];
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updateDoctorInfo: async (id, data) => {
    try {
      // Lấy user_id từ bảng doctor
      const { fullname, dob, email, identity_no, phone_no, gender } = data;
      const sql = `
      UPDATE user SET 
        fullname = ?, 
        dob = ?, 
        email = ?, 
        identity_no = ?, 
        phone_no = ?, 
        gender = ?
      WHERE id = ?
    `;
      const [result] = await conn.query(sql, [
        fullname,
        dob,
        email,
        identity_no,
        phone_no,
        gender,
        id,
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Doctor;
