const client = require("../database");
const bcrypt = require("bcrypt");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class UserStore {
  async index() {
    try {
      const sql = "SELECT * FROM users";
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
      const sql = "SELECT * FROM users WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
  async create(user) {
    try {
      const sql =
        "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING *";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        user.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [
        user.username,
        user.email,
        hash,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }

  async update(user, id) {
    try {
      const sql =
        "UPDATE users SET username=($1), email=($2), password=($3) where id=($4) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        user.username,
        user.email,
        user.password,
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
      const sql = "DELETE FROM users WHERE id=($1) RETURNING * ";
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
      const sql = "SELECT * FROM users WHERE username=($1)";
      const sql2 = "UPDATE users SET last_login=(to_timestamp($1/ 1000.0)) where username=($2)";
      const conn = await client.connect();
      const result = await conn.query(sql, [username]);
      conn.release();
      await conn.query(sql2, [Date.now(),username]);
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password))
        return user;
      }
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
    return null;
  }
}

module.exports = UserStore;
