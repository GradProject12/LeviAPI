const client = require("../database");
const bcrypt = require("bcrypt");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class ParentStore {
  async index() {
    try {
      const sql = "SELECT * FROM parents";
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
      const sql = "SELECT * FROM parents WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
  async create(parent) {
    try {
      const sql =
        "INSERT INTO parents(full_name, email, phone, password, image, doctor_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        parent.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [
        parent.full_name,
        parent.email,
        parent.phone,
        hash,
        parent.image,
        parent.doctor_id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }

  async update(parent, id) {
    try {
      const sql =
        "UPDATE parents SET full_name($1), email=($2), phone=($3), password=($4), image=($5), doctor_id=($6) where id=($7) RETURNING * ";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        parent.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [
        parent.full_name,
        parent.email,
        parent.phone,
        hash,
        parent.image,
        parent.doctor_id,
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
      const sql = "DELETE FROM parents WHERE id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }

  async authenticate(username, password) {
    try {
      const sql = "SELECT * FROM parents WHERE username=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [username]);
      conn.release();
      if (result.rows.length) {
        const parent = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, parent.password))
          return doctor;
      }
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
    return null;
  }
}

module.exports = ParentStore;
