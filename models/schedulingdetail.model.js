const conn = require("../db");

const SchedulingDetail = {
  create: async (body) => {
    try {
      const status = "Process";
      const sql = `
        INSERT INTO scheduling_detail (id, doctor_id, patient_id, workschedule_id, date, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      console.log(body);
      const [result] = await conn.query(sql, [
        body.id,
        body.doctor_id,
        body.patient_id,
        body.workschedule_id,
        body.date,
        status,
      ]);
      const sqlPurchase =
        "INSERT INTO purchase (scheduling_details_id, status, total) VALUES (?, ?, ?)";
      const [resultPurchase] = await conn.query(sqlPurchase, [
        body.id,
        "Pending",
        0.5,
      ]);
      return body.id;
    } catch (err) {
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const sql = "SELECT * FROM scheduling_detail WHERE id = ?";
      const [result] = await conn.query(sql, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAll: async () => {
    try {
      const sql = `SELECT 
        sd.id,
        sd.date,
        ws.times,
        u.fullname AS doctor_name,
        f.name AS facility_name,
        sd.doctor_id, 
        sp.name AS "specialty_name",
        d.facility_id,
        sd.status,
        sp.id AS "specialty_id"
      FROM scheduling_detail AS sd
      INNER JOIN workschedule AS ws ON sd.workschedule_id = ws.id
      INNER JOIN doctor AS d ON sd.doctor_id = d.id
      INNER JOIN user AS u ON d.user_id = u.id
      INNER JOIN facility AS f ON d.facility_id = f.id
      INNER JOIN specialty AS sp ON sp.id = d.specialty_id
      `;
      const [result] = await conn.query(sql);

      // Sử dụng for...of để đồng bộ
      for (const item of result) {
        try {
          await SchedulingDetail.checkExpired(item.id, {
            date: item.date,
            times: item.times,
            status: item.status,
          });
        } catch (err) {
          console.log(err);
        }
      }

      const [result2] = await conn.query(sql);
      return result2;
    } catch (err) {
      throw err;
    }
  },
  getByPatientId: async (id) => {
    try {
      const sql = `SELECT 
        sd.id,
        sd.date,
        ws.times,
        u.fullname AS doctor_name,
        f.name AS facility_name,
        sd.doctor_id, 
        sp.name AS "specialty_name",
		  d.facility_id,
      sd.status,
		  sp.id AS "specialty_id"
      FROM scheduling_detail AS sd
      INNER JOIN workschedule AS ws ON sd.workschedule_id = ws.id
      INNER JOIN doctor AS d ON sd.doctor_id = d.id
      INNER JOIN user AS u ON d.user_id = u.id
      INNER JOIN facility AS f ON d.facility_id = f.id
      INNER JOIN specialty AS sp ON sp.id = d.specialty_id
      WHERE sd.patient_id = ? `;
      const [result] = await conn.query(sql, [id]);
      for (const item of result) {
        try {
          await SchedulingDetail.checkExpired(item.id, {
            date: item.date,
            times: item.times,
            status: item.status,
          });
        } catch (err) {
          console.log(err);
        }
      }

      const [result2] = await conn.query(sql, [id]);
      return result2;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  compareTimes: (t1, t2) => {
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hôm nay (YYYY-MM-DD)
    const date1 = new Date(`${today}T${t1}:00`);
    const date2 = new Date(`${today}T${t2}:00`);
    console.log({ date1, date2 });
    return date1 > date2;
  },
  checkExpired: async (id, data) => {
    try {
      const { date, times, status } = data;
      // Lấy giờ Việt Nam (GMT+7)
      const now = new Date();
      const vnOffset = 7 * 60; // phút
      const localOffset = now.getTimezoneOffset(); // phút
      const vnTime = new Date(now.getTime() + (vnOffset + localOffset) * 60000);

      // Hàm format ngày yyyy-mm-dd theo giờ VN
      function formatVNDate(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      // Format ngày lịch
      let formatedDate;
      if (date instanceof Date) {
        const vnDate = new Date(
          date.getTime() + (vnOffset + localOffset) * 60000
        );
        formatedDate = formatVNDate(vnDate);
      } else if (typeof date === "string") {
        formatedDate = date.slice(0, 10);
      } else {
        formatedDate = date;
      }

      // Ngày và giờ hiện tại ở VN
      const todayStr = formatVNDate(vnTime);
      const hour = String(vnTime.getHours()).padStart(2, "0");
      const minute = String(vnTime.getMinutes()).padStart(2, "0");
      const currentTime = `${hour}:${minute}`; // "HH:mm"

      // times dạng "HH:mm - HH:mm"
      const endTime = times.split(" - ")[1]?.trim();
      console.log({ formatedDate, todayStr });
      // So sánh ngày và giờ
      if (formatedDate < todayStr) {
        if (status !== "Done") {
          const sql = `UPDATE scheduling_detail SET status = 'Expired' WHERE id = ?`;
          await conn.query(sql, [id]);
        }
        return "Expired";
      } else if (formatedDate === todayStr) {
        // So sánh giờ kết thúc với giờ hiện tại
        if (endTime < currentTime) {
          if (status !== "Done") {
            const sql = `UPDATE scheduling_detail SET status = 'Expired' WHERE id = ?`;
            await conn.query(sql, [id]);
          }
          return "Expired";
        }
      }
      // Nếu chưa đến lịch thì giữ nguyên
      return status;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = SchedulingDetail;
