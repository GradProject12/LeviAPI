const client = require("../database");
const bcrypt = require("bcrypt");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

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
        else throw new Error("Wrong password!");
      } else throw new Error("email is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async isVerified(email) {
    try {
      const sql = "SELECT verified,role FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) {
        return result.rows[0];
      } else {
        throw new Error("email is not found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async emailExist(email) {
    try {
      const sql = "SELECT EXISTs(SELECT 1 FROM users WHERE email=($1))";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      return result.rows[0].exists;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async storePasswordResetToken(secret, email) {
    try {
      const sql =
        "UPDATE users SET reset_token=($1) WHERE email=($2) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [secret, email]);
      conn.release();
      console.log(result.rows);
      if (result.rows.length) return result.rows[0];
      else throw new Error("email address not exists");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkResetToken(email) {
    try {
      const sql = "SELECT reset_token FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("email address is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updatePassword(email, password) {
    try {
      const sql =
        "UPDATE users SET password=($1) WHERE email=($2) RETURNING * ";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [hash, email]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("email address not exists");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async checkOldPassword(user_id, old_password) {
    try {
      const sql = "SELECT password FROM users WHERE user_id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id]);
      conn.release();
      if (result.rows.length) {
        const { password } = result.rows[0];
        if (bcrypt.compareSync(old_password + BCRYPT_PASSWORD, password))
          return password;
        else throw new Error("old password is incorrect!");
      } else throw new Error("user is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async changePassword(new_password, user_id) {
    try {
      const sql =
        "UPDATE users SET password=($1) WHERE user_id=($2) RETURNING * ";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        new_password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [hash, user_id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("email address not exists");
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserStore;
