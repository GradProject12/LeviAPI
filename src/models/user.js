const client = require("../database");
const bcrypt = require("bcrypt");

const { BCRYPT_PASSWORD } = process.env;

class UserStore {
  async checkVerified(email) {
    try {
      const sql = "SELECT verified FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("email address is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async verifyData(email) {
    try {
      const sql = "SELECT * FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("email address is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async setVerified(email) {
    try {
      const sql =
        "UPDATE users SET verified=($1) WHERE email=($2) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [true, email]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("email address is not valid");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(email, password) {
    try {
      const sql = "SELECT * FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password))
          return user;
      } else throw new Error("email is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async isVerified(email) {
    try {
      const sql = "SELECT * FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) {
        if (result.rows[0].verified) return true;
        else false;
      } else {
        throw new Error("email is not found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserStore;
