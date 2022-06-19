const client = require("../database");
const bcrypt = require("bcrypt");
const { stringBetweenParentheses } = require("../services/helpers");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class ParentStore {
  async index(params) {
    try {
      const sql = `SELECT
      (SELECT COUNT(*) 
       FROM users
      ) as count, 
      (SELECT json_agg(t.*) FROM (
          SELECT * FROM users
          JOIN parents on users.user_id=parents.parent_id ORDER BY ($1) OFFSET ($2) LIMIT ($3)
      ) AS t) AS rows `
      const conn = await client.connect();
      const result = await conn.query(sql, [
        params.filter,
        (params.page - 1) * params.per_page,
        params.per_page,
      ]);
      conn.release();
      return result.rows[0];
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
  
  async showParentAnalayses(parent_id) {
    try {
      const sql =
        `SELECT * FROM robot_analysis AS ra
         JOIN robots r ON ra.robot_id=r.robot_id
         JOIN parents AS p ON r.parent_id=p.parent_id
         WHERE p.parent_id =($1) ORDER BY ra.created_at DESC`;
      const conn = await client.connect();
      const result = await conn.query(sql, [parent_id]);
      conn.release();
      if (result.rows.length) return result.rows;
      else throw new Error("Analyses are not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async showDoctor(doctor_id,parent_id) {
    try {
      const sql =
        `
        SELECT
      (SELECT ROUND(AVG(rating)) 
       FROM doctors_ratings WHERE doctor_id=($1)
      ) AS rating_average ,
      (SELECT COUNT(*) FROM doctors_ratings WHERE doctor_id=($1) ) AS reviews_number,
      (SELECT EXISTS(SELECT 1 FROM doctors_ratings WHERE parent_id=($2))) AS rated,  
      (SELECT json_agg(t.*) FROM (
          SELECT * FROM (SELECT doctor_id,full_name,email,phone,
            profile_image,certificate_image,clinic_location,working_schedule
             FROM users JOIN doctors on users.user_id=doctors.doctor_id) AS users WHERE doctor_id=($1)
      ) AS t) AS rows
        `
      const conn = await client.connect();
      const result = await conn.query(sql, [doctor_id, parent_id]);
      conn.release();
      if (result.rows[0].rows) return result.rows[0];
      else throw new Error("doctor is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
  
  async rateDoctor(params) {
    try {
      const sql =`INSERT INTO doctors_ratings (doctor_id,parent_id,rating,review) VALUES ($1,$2,$3,$4) RETURNING *`
      const conn = await client.connect();
      const result = await conn.query(sql, [params.doctor_id, params.parent_id, params.rating, params.review]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("doctor is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      if (error.code === "23505") throw new Error(`Doctor is already rated`);
      throw new Error(error.message);
    }
  }
  
}

module.exports = ParentStore;
