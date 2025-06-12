const conn = require("../db/index");

const Statistics = {
  getStatisticsAppoinmentByDoctorId: async (doctor_id, year) => {
    try {
      const sql = `-- Tạo bảng tạm thời gồm các tháng từ 1 đến 12
            WITH months AS (
                SELECT 1 AS month UNION
                SELECT 2 UNION
                SELECT 3 UNION
                SELECT 4 UNION
                SELECT 5 UNION
                SELECT 6 UNION
                SELECT 7 UNION
                SELECT 8 UNION
                SELECT 9 UNION
                SELECT 10 UNION
                SELECT 11 UNION
                SELECT 12
            ),
            -- Thống kê số lịch đã thanh toán theo tháng
            purchased_per_month AS (
                SELECT 
                    MONTH(sd.date) AS month,
                    COUNT(*) AS total
                FROM 
                    scheduling_detail AS sd
                INNER JOIN 
                    purchase AS p ON p.scheduling_details_id = sd.id
                WHERE 
                    p.status = 'Purchased'
                    AND YEAR(sd.date) = ?
                    AND sd.doctor_id = ?
                GROUP BY 
                    MONTH(sd.date)
            )
            -- Ghép bảng tháng với kết quả thống kê để đảm bảo đủ 12 tháng
            SELECT 
                m.month,
                COALESCE(ppm.total, 0) AS total
            FROM 
                months m
            LEFT JOIN 
                purchased_per_month ppm ON m.month = ppm.month
            ORDER BY 
                m.month;
            `;
      const [result] = await conn.query(sql, [year, doctor_id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  totalRevenue: async () => {
    try {
      const sql = `SELECT COUNT(*) * 1 as total FROM purchase AS p WHERE p.status = "Purchased"`;
      const [result] = await conn.query(sql);
      return result[0].total;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  totalFacility: async () => {
    try {
      const sql = `SELECT COUNT(*) AS total FROM facility;`;
      const [result] = await conn.query(sql);
      return result[0].total;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  totalDoctor: async () => {
    try {
      const sql = `SELECT COUNT(*) AS total 
        FROM doctor AS d INNER JOIN user AS u ON d.user_id = u.id  WHERE u.status = "Actived";`;
      const [result] = await conn.query(sql);
      return result[0].total;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  totalUser: async () => {
    try {
      const sql = `SELECT COUNT(*) AS total 
        FROM patient AS p INNER JOIN user AS u ON p.user_id = u.id  WHERE u.status = "Actived";`;
      const [result] = await conn.query(sql);
      return result[0].total;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  revenuePerDoctorList: async () => {
    try {
      const sql = `SELECT 
                    d.id AS doctor_id,
                    u.fullname AS doctor_name,
                    COALESCE(SUM(CASE WHEN p.status = 'Purchased' THEN p.total ELSE 0 END), 0) AS total_income
                    FROM doctor AS d
                    INNER JOIN user AS u ON u.id = d.user_id
                    LEFT JOIN scheduling_detail AS sd ON d.id = sd.doctor_id
                    LEFT JOIN purchase AS p ON sd.id = p.scheduling_details_id
                    GROUP BY d.id, u.fullname
                    ORDER BY total_income DESC LIMIT 10;`;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  revenuePerFacility: async () => {
    try {
      const sql = `SELECT 
                        f.id AS facility_id,
                        f.name AS facility_name,
                        COALESCE(SUM(p.total), 0) AS total_income
                        FROM facility AS f
                        LEFT JOIN doctor AS d ON f.id = d.facility_id
                        LEFT JOIN scheduling_detail AS sd ON d.id = sd.doctor_id
                        LEFT JOIN purchase AS p ON sd.id = p.scheduling_details_id AND p.status = 'Purchased'
                        GROUP BY f.id, f.name
                        ORDER BY total_income DESC LIMIT 10;`;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  },
  rateAppointments: async () => {
    try {
      const sql = `SELECT status, COUNT(*) AS total
                  FROM (
                      SELECT status FROM scheduling_detail
                  ) AS combined_status
                  GROUP BY status;`;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  },
  appointmentsPerMonth: async () => {
    try {
      const sql = `SELECT 
            DATE_FORMAT(sd.date, '%Y-%m') AS month,
            COUNT(*) AS total
            FROM 
            scheduling_detail sd
            JOIN 
            purchase p ON sd.id = p.scheduling_details_id
            WHERE 
            p.status = 'Purchased'
            GROUP BY 
            DATE_FORMAT(sd.date, '%Y-%m')
            ORDER BY 
            month ASC;`;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Statistics;
