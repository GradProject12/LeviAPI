const client = require("../database");

class AnimalStore {
  async index() {
    try {
      const sql = "SELECT * FROM animals";
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
      const sql = "SELECT * FROM animals WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
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
      throw new Error(`Something Wrong ${error}`);
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
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
  async delete(id) {
    try {
      const sql = "DELETE FROM animals WHERE id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
}

module.exports = AnimalStore;
