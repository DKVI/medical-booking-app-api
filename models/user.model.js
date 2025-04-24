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
};

module.exports = User;
