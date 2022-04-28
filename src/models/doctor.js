const client = require("../database");
const bcrypt = require("bcrypt");
const { stringBetweenParentheses } = require("../services/helpers");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class DoctorStore {
  async index(params) {
    try {
      const sql =
        "SELECT *,COUNT(*) OVER() AS total_count FROM users  JOIN doctors on users.user_id=doctors.doctor_id ORDER BY ($1) OFFSET ($2) LIMIT ($3)";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        params.filter,
        (params.page - 1) * params.per_page,
        params.per_page,
      ]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async show(id) {
    try {
      const sql =
        "SELECT * FROM (SELECT * FROM users JOIN doctors on users.user_id=doctors.doctor_id) AS users WHERE user_id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("doctor is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
  async create(doctor) {
    try {
      const addToUsers =
        "INSERT INTO users (full_name, email, phone, password, profile_image, role, secret) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *";
      const sql =
        "INSERT INTO doctors(doctor_id, clinic_location, working_schedule,national_id) VALUES($1,$2,$3,$4) RETURNING *";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        doctor.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const user = await conn.query(addToUsers, [
        doctor.full_name,
        doctor.email,
        doctor.phone,
        hash,
        doctor.profile_image,
        "doctor",
        doctor.secret,
      ]);
      const newUser = user.rows[0];
      const result = await conn.query(sql, [
        newUser.user_id,
        doctor.clinic_location,
        doctor.working_schedule,
        doctor.national_id,
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

  async update(doctor, id) {
    try {
      const updateUser =
        "UPDATE  users SET email=COALESCE($1,email), phone=COALESCE($2,phone), password=COALESCE($3,password), profile_image=COALESCE($4,profile_image) WHERE user_id=($5) RETURNING *";
      const updateDoctor =
        "UPDATE doctors SET clinic_location=COALESCE($1,clinic_location),  working_schedule=COALESCE($2,working_schedule) where doctor_id=($3) RETURNING * ";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        doctor.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result1 = await conn.query(updateUser, [
        doctor.email,
        doctor.phone,
        hash,
        doctor.profile_image,
        id,
      ]);
      const result2 = await conn.query(updateDoctor, [
        doctor.clinic_location,
        doctor.working_schedule,
        id,
      ]);
      conn.release();
      const { user_id, ...rest } = result1.rows[0];
      if (result1.rows.length && result2.rows.length)
        return { doctor_id: user_id, ...rest, ...result2.rows[0] };
      else throw new Error("doctor is not found");
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
      const sql = "DELETE FROM doctors WHERE doctor_id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("doctor is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }

  async forget(email, token) {
    try {
      const sql =
        "INSERT INTO password_reset (email,token) VALUES ($1,$2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [email, token]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("email is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = DoctorStore;
