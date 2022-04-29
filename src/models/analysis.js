const client = require("../database");
const { stringBetweenParentheses } = require("../services/helpers");

class AnalysisStore {
  async getAllAnalysisBelongToRobot(robot_id) {
    try {
      const sql =
        "SELECT * FROM robot_analysis WHERE robot_id =($1) ORDER BY created_at DESC";
      const conn = await client.connect();
      const result = await conn.query(sql, [robot_id]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async showSingleAnalysisBelongToRobot(analysis_id) {
    try {
      const sql = "SELECT * FROM robot_analysis WHERE analysis_id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [analysis_id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("analysis is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
  async create(analysis, robot_id) {
    try {
      const sql =
        "INSERT INTO robot_analysis(analysis, robot_id) VALUES($1, $2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [analysis, robot_id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505")
        throw new Error(
          `${stringBetweenParentheses(error.detail)} already exists`
        );
      if (error.code === "23502") throw new Error(`${error.column} is null`);
      if (error.code === "23503") throw new Error(`This robot doesn't exist`);

      throw new Error(error.message);
    }
  }
}

module.exports = AnalysisStore;
