const client = require("../database");
const bcrypt = require("bcrypt");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class RobotStore {
  async index() {
    try {
      const sql = "SELECT * FROM robots";
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }

  async show(id) {
    try {
      const sql = "SELECT * FROM robots WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
  async create(robot) {
    try {
      const sql =
        "INSERT INTO robots(parent_id, doctor_id) VALUES($1,$2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        robot.parent_id,
        robot.doctor_id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }

  async update(robot, id) {
    try {
      const sql =
        "UPDATE robots SET parent_id($1), doctor_id=($2) where id=($3) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        robot.parent_id,
        robot.doctor_id,
        id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
  async delete(id) {
    try {
      const sql = "DELETE FROM robots WHERE id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }

}

module.exports = RobotStore;
