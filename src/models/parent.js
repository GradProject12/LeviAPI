const client = require("../database");
const bcrypt = require("bcrypt");
const { stringBetweenParentheses } = require("../services/helpers");

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
      throw new Error(error.message);
    }
  }

  async show(id) {
    try {
      const sql = "SELECT * FROM parents WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("parent is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
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
      if (error.code === "23505")
        throw new Error(
          `${stringBetweenParentheses(error.detail)} already exists`
        );
      if (error.code === "23502") throw new Error(`${error.column} is null`);

      throw new Error(error.message);
    }
  }

  async update(parent, id) {
    try {
      const sql =
        "UPDATE parents SET full_name=COALESCE($1,full_name), email=COALESCE($2,email), phone=COALESCE($3,phone), password=COALESCE($4,password), image=COALESCE($5,image), doctor_id=COALESCE($6,doctor_id) where id=($7) RETURNING * ";
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
      if (result.rows.length) return result.rows[0];
      else throw new Error("parent is not found");
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
      const sql = "DELETE FROM parents WHERE id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("parent is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
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
      throw new Error(error.message);
    }
    return null;
  }
}

module.exports = ParentStore;
