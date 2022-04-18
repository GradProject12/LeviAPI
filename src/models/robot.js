const client = require("../database");
const { stringBetweenParentheses } = require("../services/helpers");


class RobotStore {
  async index() {
    try {
      const sql = "SELECT * FROM robots";
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async show(id) {
    try {
      const sql = "SELECT * FROM robots WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("robot is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
  async create(robot) {
    try {
      const sql =
        "INSERT INTO robots(parent_id, doctor_id) VALUES($1,$2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [robot.parent_id, robot.doctor_id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505")
        throw new Error(
          `${stringBetweenParentheses(error.detail)} already exists`
        );
      if (error.code === "23502") throw new Error(`${error.column} is null`);

      throw new Error(error.message);
    }
  }

  async update(robot, id) {
    try {
      const sql =
        "UPDATE robots SET parent_id=COALESCE($1,parent_id), doctor_id=COALESCE($2,doctor_id) where id=($3) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        robot.parent_id,
        robot.doctor_id,
        id,
      ]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("robot is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);

      if (error.code === "23505")
        throw new Error(
          `${stringBetweenParentheses(error.detail)} already exists`
        );
      if (error.code === "23502") throw new Error(`${error.column} is null`);

      throw new Error(error.message);
    }
  }
  async delete(id) {
    try {
      const sql = "DELETE FROM robots WHERE id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("robot is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
}

module.exports = RobotStore;
