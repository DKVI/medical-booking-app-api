const conn = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = {
  getALL: async () => {
    try {
      const sql = `SELECT * FROM user`;
      const [result] = await conn.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
  },
  resetPassword: async ({ username, email, newPassword }) => {
    try {
      const sql =
        "UPDATE user SET password = ? WHERE username = ? AND email = ?";
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const [result] = await conn.query(sql, [
        hashedNewPassword,
        username,
        email,
      ]);
      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  },
  createAccount: async (username, password, email) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql =
        "INSERT INTO user (username, password, email, status, role, avatar) VALUES (?, ?, ?, ?, ?, ?)";
      const [result] = await conn.query(sql, [
        username,
        hashedPassword,
        email,
        "Pending",
        "patient",
        "https://avatar.iran.liara.run/public/1",
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
  deleteById: async (id) => {
    try {
      // Xóa doctor nếu tồn tại
      await conn.query("DELETE FROM doctor WHERE user_id = ?", [id]);
      // Xóa patient nếu tồn tại
      await conn.query("DELETE FROM patient WHERE user_id = ?", [id]);
      // Xóa user
      const [result] = await conn.query("DELETE FROM user WHERE id = ?", [id]);
      return {
        success: result.affectedRows > 0,
        message:
          result.affectedRows > 0
            ? "User deleted successfully"
            : "User not found",
      };
    } catch (err) {
      throw err;
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
      const secondSql = "INSERT INTO patient (user_id) VALUES (?)";
      const [secondRows] = await conn.query(secondSql, [user.id]);

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
      if (user.role !== "patient") {
        return {
          success: false,
          message: "Account not available!",
        };
      }
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
        "SELECT *,u.id AS user_id, pt.id AS patient_id FROM user AS u JOIN patient AS pt ON u.id = pt.user_id WHERE username = ?";
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
    let fullname,
      gender,
      gmail,
      idNumber,
      insuranceNumber,
      phoneNumber,
      username,
      height,
      weight,
      address,
      dob;
    let userRows, userId, updateUserResult, updatePatientResult;
    try {
      // Lấy thông tin từ userInfo
      fullname = userInfo.fullname;
      gender = userInfo.gender;
      gmail = userInfo.gmail;
      idNumber = userInfo.idNumber;
      insuranceNumber = userInfo.insuranceNumber;
      phoneNumber = userInfo.phoneNumber;
      username = userInfo.username;
      weight = userInfo.weight;
      height = userInfo.height;
      dob = userInfo.dob;
      address = userInfo.address;

      // Bắt đầu transaction
      try {
        await conn.query("START TRANSACTION");
      } catch (error) {
        console.error("Error starting transaction:", error.message);
        throw error;
      }

      // Lấy user_id tương ứng với username
      try {
        const getUserIdSql = "SELECT id FROM user WHERE username = ?";
        [userRows] = await conn.query(getUserIdSql, [username]);
      } catch (error) {
        console.error("Error getting user id:", error.message);
        throw error;
      }

      if (!userRows || userRows.length === 0) {
        // Rollback nếu không tìm thấy user
        try {
          await conn.query("ROLLBACK");
        } catch (rollbackError) {
          console.error("Error during rollback:", rollbackError.message);
        }
        throw new Error("User not found");
      }

      userId = userRows[0].id;

      // Cập nhật bảng user
      try {
        const updateUserSql = `
          UPDATE user
          SET 
            fullname = ?,
            gender = ?,
            email = ?,
            identity_no = ?,
            phone_no = ?,
            address = ?,
            dob = ?
          WHERE id = ?
        `;
        [updateUserResult] = await conn.query(updateUserSql, [
          fullname,
          gender,
          gmail,
          idNumber,
          phoneNumber,
          address,
          dob,
          userId,
        ]);
      } catch (error) {
        console.error("Error updating user table:", error.message);
        try {
          await conn.query("ROLLBACK");
        } catch (rollbackError) {
          console.error("Error during rollback:", rollbackError.message);
        }
        throw error;
      }

      // Cập nhật bảng patient
      try {
        const updatePatientSql = `
          UPDATE patient
          SET insurance_no = ?, weight = ?, height = ?
          WHERE user_id = ?
        `;
        [updatePatientResult] = await conn.query(updatePatientSql, [
          insuranceNumber,
          weight,
          height,
          userId,
        ]);
      } catch (error) {
        console.error("Error updating patient table:", error.message);
        try {
          await conn.query("ROLLBACK");
        } catch (rollbackError) {
          console.error("Error during rollback:", rollbackError.message);
        }
        throw error;
      }

      // Commit transaction
      try {
        await conn.query("COMMIT");
      } catch (error) {
        console.error("Error during commit:", error.message);
        throw error;
      }

      return {
        success: true,
        message: "Patient information updated successfully",
      };
    } catch (error) {
      // Rollback transaction nếu có lỗi
      try {
        await conn.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Error during rollback:", rollbackError.message);
      }
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
  loginDoctor: async (username, password) => {
    try {
      const selectSql = "SELECT * FROM user WHERE username = ?";
      const [rows] = await conn.query(selectSql, [username]);

      if (rows.length === 0) {
        return { success: false, message: "Invalid username or password" };
      }

      const user = rows[0];

      // Kiểm tra vai trò của user
      if (user.role !== "doctor") {
        return {
          success: false,
          message: "Access denied: Not a doctor account",
        };
      }

      // Kiểm tra trạng thái tài khoản
      if (user.status !== "Actived") {
        return { success: false, message: "Account is not activated" };
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { success: false, message: "Invalid username or password" };
      }

      // Tạo token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      return { success: true, token, message: "Login successfully!" };
    } catch (error) {
      console.error("Error during doctor login:", error.message);
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
  create: async ({
    username,
    password,
    fullname = null,
    identity_no = null,
    phone_no = null,
    email = null,
    role,
    status = "Pending",
    gender = null,
    avatar = "https://avatar.iran.liara.run/public/1",
    dob = null,
    address = null,
  }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `
        INSERT INTO user (
          username, password, fullname, identity_no, phone_no, email, role, status, gender, avatar, dob, address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await conn.query(sql, [
        username,
        hashedPassword,
        fullname,
        identity_no,
        phone_no,
        email,
        role,
        status,
        gender,
        avatar,
        dob,
        address,
      ]);
      return {
        success: true,
        userId: result.insertId,
        message: "User created successfully",
      };
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw error;
    }
  },

  // ...existing code...
  updateById: async (id, data) => {
    try {
      const fields = [];
      const values = [];

      if (data.username !== undefined) {
        fields.push("username = ?");
        values.push(data.username);
      }
      if (data.password !== undefined) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        fields.push("password = ?");
        values.push(hashedPassword);
      }
      if (data.fullname !== undefined) {
        fields.push("fullname = ?");
        values.push(data.fullname);
      }
      if (data.identity_no !== undefined) {
        fields.push("identity_no = ?");
        values.push(data.identity_no);
      }
      if (data.phone_no !== undefined) {
        fields.push("phone_no = ?");
        values.push(data.phone_no);
      }
      if (data.email !== undefined) {
        fields.push("email = ?");
        values.push(data.email);
      }
      if (data.role !== undefined) {
        fields.push("role = ?");
        values.push(data.role);
      }
      if (data.status !== undefined) {
        fields.push("status = ?");
        values.push(data.status);
      }
      if (data.gender !== undefined) {
        fields.push("gender = ?");
        values.push(data.gender);
      }
      if (data.avatar !== undefined) {
        fields.push("avatar = ?");
        values.push(data.avatar);
      }
      if (data.dob !== undefined) {
        fields.push("dob = ?");
        values.push(data.dob);
      }
      if (data.address !== undefined) {
        fields.push("address = ?");
        values.push(data.address);
      }

      if (fields.length === 0) {
        return { success: false, message: "No data to update" };
      }

      const sql = `UPDATE user SET ${fields.join(", ")} WHERE id = ?`;
      values.push(id);

      const [result] = await conn.query(sql, values);
      return {
        success: result.affectedRows > 0,
        message:
          result.affectedRows > 0
            ? "User updated successfully"
            : "User not found or no changes made",
      };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = User;
