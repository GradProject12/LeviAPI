const client = require("../database");
const { stringBetweenParentheses } = require("../services/helpers");

class AnimalStore {
  async index() {
    try {
      const sql = "SELECT * FROM animals";
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
      const sql = "SELECT * FROM animals WHERE animal_id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("Animal is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
  async create(animal) {
    try {
      const sql =
        "INSERT INTO animals(name, picture, sound, spelled) VALUES($1, $2, $3, $4) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        animal.name,
        animal.picture,
        animal.sound,
        animal.spelled,
      ]);
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

  async update(animal, id) {
    try {
      const sql =
        "UPDATE animals SET name=COALESCE($1,name), picture=COALESCE($2,picture), sound=COALESCE($3,sound), spelled=COALESCE($4,spelled) where id=($5) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        animal.name,
        animal.picture,
        animal.sound,
        animal.spelled,
        id,
      ]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("Animal is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`ID must be integer`);

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
      const sql = "DELETE FROM animals WHERE id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("Animal is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`ID must be integer`);
      throw new Error(error.message);
    }
  }
}

module.exports = AnimalStore;
