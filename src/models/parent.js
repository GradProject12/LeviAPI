const client = require("../database");
const bcrypt = require("bcrypt");
const { stringBetweenParentheses } = require("../services/helpers");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class ParentStore {
  async index() {
    try {
      const sql =
        "SELECT * FROM users JOIN parents on users.user_id=parents.parent_id";
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
      const sql =
        "SELECT * FROM (SELECT * FROM users JOIN parents on users.user_id=parents.parent_id) AS users WHERE parent_id=($1)";
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
      const addToUsers =
        "INSERT INTO users (full_name, email, phone, password, profile_image, role, secret) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *";
      const sql =
        "INSERT INTO parents(parent_id,doctor_id) VALUES($1,$2) RETURNING *";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        parent.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const user = await conn.query(addToUsers, [
        parent.full_name,
        parent.email,
        parent.phone,
        hash,
        parent.profile_image,
        "parent",
        parent.secret,
      ]);
      const newUser = user.rows[0];

      const result = await conn.query(sql, [newUser.user_id, parent.doctor_id]);
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

  async verifyData(email) {
    try {
      const sql = "SELECT secret,verified FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("email address is not valid");
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

  async update(parent, id) {
    try {
      const updateUser =
        "UPDATE  users SET email=COALESCE($1,email), phone=COALESCE($2,phone), password=COALESCE($3,password), profile_image=COALESCE($4,profile_image) WHERE user_id=($5) RETURNING *";
      const updateParent =
        "UPDATE parents SET doctor_id=COALESCE($1,doctor_id) where parent_id=($2) RETURNING * ";

      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        parent.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result1 = await conn.query(updateUser, [
        parent.email,
        parent.phone,
        hash,
        parent.profile_image,
        id,
      ]);
      const result2 = await conn.query(updateParent, [parent.doctor_id, id]);
      conn.release();
      const { user_id, ...rest } = result1.rows[0];

      if (result1.rows.length && result2.rows.length)
        return { parent_id: user_id, ...rest, ...result2.rows[0] };
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
      const sql = "DELETE FROM parents WHERE parent_id=($1) RETURNING * ";
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

  async login(email, password) {
    try {
      const sql = "SELECT * FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) {
        const parent = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, parent.password))
          return parent;
      } else throw new Error("email is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ParentStore;
