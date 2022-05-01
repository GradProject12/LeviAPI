const client = require("../database");
const bcrypt = require("bcrypt");
const { stringBetweenParentheses } = require("../services/helpers");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class AdminStore {
  async index() {
    try {
      const sql = "SELECT * FROM admins";
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
      const sql = "SELECT * FROM admins WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("admin is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }

  async create(admin) {
    try {
      const sql =
        "INSERT INTO admins(role,username,email,password,image) VALUES($1,$2,$3,$4,$5) RETURNING *";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        admin.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [
        admin.role,
        admin.username,
        admin.email,
        hash,
        admin.image,
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

  async update(admin, id) {
    try {
      const sql =
        "UPDATE admins SET role=COALESCE($1,role), username=COALESCE($2,username), email=COALESCE($3,email), password=COALESCE($4,password), image=COALESCE($5,image) where id=($6) RETURNING * ";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        admin.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [
        admin.role,
        admin.username,
        admin.email,
        hash,
        admin.image,
        id,
      ]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("admin is not found");
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
      const sql = "DELETE FROM admins WHERE id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("admin is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }

  async authenticate(username, password) {
    try {
      const sql = "SELECT * FROM admins WHERE username=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [username]);
      conn.release();
      if (result.rows.length) {
        const admin = result.rows[0];
        console.log(admin);
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, admin.password))
          return admin;
        else throw new Error("password is not correct");
      }
      throw new Error("username not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async acceptDoctor(doctor_id) {
    try {
      const sql =
        "UPDATE doctors SET accepted_status=($1) WHERE doctor_id=($2) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [true, doctor_id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("doctor is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
}

module.exports = AdminStore;
