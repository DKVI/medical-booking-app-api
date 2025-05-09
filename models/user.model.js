const conn = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = {
  createAccount: async (username, password, email) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql =
        "INSERT INTO user (username, password, email, status, role) VALUES (?, ?, ?, ?, ?)";
      const [result] = await conn.query(sql, [
        username,
        hashedPassword,
        email,
        "Pending",
        "patient",
      ]);

      const token = jwt.sign(
        { id: result.insertId, username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      return { success: true, token, message: "Account created successfully" };
    } catch (error) {
      console.error("Error creating account:", error.message);
      throw error;
    }
  },

  activeAccount: async (token) => {
    try {
      // Xác thực và giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kiểm tra nếu không có thông tin cần thiết trong token
      if (!decoded || !decoded.username) {
        return { success: false, message: "Invalid token payload" };
      }

      // Tìm tài khoản trong cơ sở dữ liệu dựa trên username
      const selectSql = "SELECT * FROM user WHERE username = ?";
      const [rows] = await conn.query(selectSql, [decoded.username]);

      if (rows.length === 0) {
        return { success: false, message: "User not found" };
      }

      const user = rows[0];

      // Kiểm tra trạng thái tài khoản
      if (user.status === "Actived") {
        return { success: false, message: "Account is already activated" };
      }

      // Cập nhật trạng thái thành "Actived"
      const updateSql = "UPDATE user SET status = ? WHERE username = ?";
      await conn.query(updateSql, ["Actived", decoded.username]);

      return { success: true, message: "Account activated successfully" };
    } catch (error) {
      console.error("Error activating account:", error.message);
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return { success: false, message: "Invalid or expired token" };
      }
      throw error;
    }
  },

  login: async (username, password) => {
    try {
      const selectSql = "SELECT * FROM user WHERE username = ?";
      const [rows] = await conn.query(selectSql, [username]);

      if (rows.length === 0) {
        return { success: false, message: "Invalid username or password" };
      }

      const user = rows[0];
      // Kiểm tra trạng thái tài khoản trước
      if (user.status !== "Actived") {
        console.log(false);
        return { success: false, message: "Account is not activated" };
      } else {
        console.log(true);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return { success: false, message: "Invalid username or password" };
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        return { success: true, token, message: "Login successfully!" };
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  },
  verify: async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.username) {
        return { success: false, message: "Invalid token payload" };
      }

      const selectSql =
        "SELECT *,u.id AS user_id,pt.id AS patient_id FROM user AS u JOIN patient AS pt WHERE username = ?";
      const [rows] = await conn.query(selectSql, [decoded.username]);

      if (rows.length === 0) {
        return { success: false, message: "User not found" };
      }

      const user = rows[0];

      if (user.status !== "Actived") {
        return { success: false, message: "Account is not activated" };
      }

      return { success: true, user, message: "Token verified successfully" };
    } catch (error) {
      console.error("Error verifying token:", error.message);
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return { success: false, message: "Invalid or expired token" };
      }
      throw error;
    }
  },
  updatePatientInfo: async (userInfo) => {
    try {
      const {
        fullname,
        gender,
        gmail,
        idNumber,
        insuranceNumber,
        phoneNumber,
        username,
      } = userInfo;

      // Bắt đầu transaction
      await conn.query("START TRANSACTION");

      // Lấy user_id tương ứng với username
      const getUserIdSql = "SELECT id FROM user WHERE username = ?";
      const [userRows] = await conn.query(getUserIdSql, [username]);

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      const userId = userRows[0].id;

      // Cập nhật bảng user
      const updateUserSql = `
        UPDATE user
        SET 
          fullname = ?,
          gender = ?,
          email = ?,
          identity_no = ?,
          phone_no = ?
        WHERE id = ?
      `;
      await conn.query(updateUserSql, [
        fullname,
        gender,
        gmail,
        idNumber,
        phoneNumber,
        userId,
      ]);

      // Cập nhật bảng patient
      const updatePatientSql = `
        UPDATE patient
        SET insurance_no = ?
        WHERE user_id = ?
      `;
      await conn.query(updatePatientSql, [insuranceNumber, userId]);

      // Commit transaction
      await conn.query("COMMIT");

      return {
        success: true,
        message: "Patient information updated successfully",
      };
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await conn.query("ROLLBACK");
      console.error("Error updating patient info:", error.message);
      throw error;
    }
  },
  changeAvatar: async (userId, avatar) => {
    try {
      console.log(userId, avatar);
      const sql = `
        UPDATE user
        SET avatar = ?
        WHERE id = ?
      `;
      const [result] = await conn.query(sql, [avatar, userId]);

      if (result.affectedRows === 0) {
        return { success: false, message: "User not found or no changes made" };
      }

      return { success: true, message: "Avatar updated successfully" };
    } catch (error) {
      console.error("Error updating avatar:", error.message);
      throw error;
    }
  },
  changePassword: async (username, password, new_password) => {
    try {
      // Tìm user theo username
      const selectSql = "SELECT * FROM user WHERE username = ?";
      const [rows] = await conn.query(selectSql, [username]);

      if (rows.length === 0) {
        return { success: false, message: "User not found" };
      }

      const user = rows[0];

      // Kiểm tra mật khẩu hiện tại
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { success: false, message: "Current password is incorrect" };
      }

      // Hash mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(new_password, 10);

      // Cập nhật mật khẩu mới
      const updateSql = "UPDATE user SET password = ? WHERE username = ?";
      const [result] = await conn.query(updateSql, [
        hashedNewPassword,
        username,
      ]);

      if (result.affectedRows === 0) {
        return { success: false, message: "Failed to update password" };
      }

      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      console.error("Error changing password:", error.message);
      throw error;
    }
  },
};

module.exports = User;
