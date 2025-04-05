const conn = require("../db");

const Test = {
  getAll: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "SELECT * FROM test";
        const [results] = await conn.query(sql);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
  getById: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "SELECT * FROM test WHERE id = ?";
        const [results] = await conn.query(sql, [id]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
  add: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data);
        const sql =
          "INSERT INTO test (fullname, email, password, username) VALUES (?)";
        const [results] = await conn.query(sql, [
          data.email,
          data.password,
          data.username,
          data.fullname,
        ]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
  update: (id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql =
          "UPDATE test SET fullname = ?, email = ?, password = ?, username = ?, dob = ? WHERE id = ?";
        const [results] = await conn.query(sql, [
          data.fullname,
          data.email,
          data.password,
          data.username,
          data.dob,
          id,
        ]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
  delete: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "DELETE FROM test WHERE id = ?";
        const [results] = await conn.query(sql, [id]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
};

module.exports = Test;
