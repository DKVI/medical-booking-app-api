const conn = require("../db");

const Specialty = {
  getAll: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "SELECT * FROM specialty";
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
        const sql = "SELECT * FROM specialty WHERE id = ?";
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
        const sql = "INSERT INTO specialty (name) VALUES (?)";
        const [results] = await conn.query(sql, [data.name]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
  update: (id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "UPDATE specialty SET name = ? WHERE id = ?";
        const [results] = await conn.query(sql, [data.name, id]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
  delete: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "DELETE FROM specialty WHERE id = ?";
        const [results] = await conn.query(sql, [id]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  },
 
};

module.exports = Specialty;
