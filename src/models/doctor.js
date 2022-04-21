const client = require("../database");
const bcrypt = require("bcrypt");
const { stringBetweenParentheses } = require("../services/helpers");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class DoctorStore {
  async index() {
    try {
      const sql =
        "SELECT * FROM users JOIN doctors on users.user_id=doctors.doctor_id";
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
        "INSERT INTO doctors(doctor_id, clinic_location, start_time, end_time, days_of_week,national_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
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
        doctor.start_time,
        doctor.end_time,
        doctor.days_of_week,
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

  async update(doctor, id) {
    try {
      const updateUser =
        "UPDATE  users SET email=COALESCE($1,email), phone=COALESCE($2,phone), password=COALESCE($3,password), profile_image=COALESCE($4,profile_image) WHERE user_id=($5) RETURNING *";
      const updateDoctor =
        "UPDATE doctors SET clinic_location=COALESCE($1,clinic_location), start_time=COALESCE($2,start_time), end_time=COALESCE($3,end_time), days_of_week=COALESCE($4,days_of_week) where doctor_id=($5) RETURNING * ";
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
        doctor.start_time,
        doctor.end_time,
        doctor.days_of_week,
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

  async login(email, password) {
    try {
      const sql = "SELECT * FROM users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) {
        const doctor = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, doctor.password))
          return doctor;
      } else throw new Error("email is not found");
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = DoctorStore;
