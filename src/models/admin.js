const client = require("../database");
const bcrypt = require("bcrypt");

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
      throw new Error(`Something Wrong ${error}`);
    }
  }

  async show(id) {
    try {
      const sql = "SELECT * FROM admins WHERE admin=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
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
      throw new Error(`Something Wrong ${error}`);
    }
  }

  async update(admin, id) {
    try {
      const sql =
        "UPDATE admins SET role=($1), username=($2), email=($3), password=($4), image=($5) where admin=($6) RETURNING * ";
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
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
  async delete(id) {
    try {
      const sql = "DELETE FROM admins WHERE id=($1) RETURNING * ";
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
      const sql = "SELECT * FROM admins WHERE username=($1)";
      // const sql2 =
      //   "UPDATE users SET last_login=(to_timestamp($1/ 1000.0)) where username=($2)";
      const conn = await client.connect();
      const result = await conn.query(sql, [username]);
      conn.release();
      // await conn.query(sql2, [Date.now(), username]);
      if (result.rows.length) {
        const admin = result.rows[0];
        console.log(admin)
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, admin.password))
          return admin;
        else throw new Error("password is not correct");
      }
      throw new Error("username not found");
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
}

module.exports = AdminStore;
