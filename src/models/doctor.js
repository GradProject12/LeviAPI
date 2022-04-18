const client = require("../database");
const bcrypt = require("bcrypt");
const { stringBetweenParentheses } = require("../services/helpers");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class DoctorStore {
  async index() {
    try {
      const sql = "SELECT * FROM doctors";
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
      const sql = "SELECT * FROM doctors WHERE id=($1)";
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
      const sql =
        "INSERT INTO doctors(full_name, email, phone, password, image, clinic_location, start_time, end_time, days_of_week) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *";
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        doctor.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [
        doctor.full_name,
        doctor.email,
        doctor.phone,
        hash,
        doctor.image,
        doctor.clinic_location,
        doctor.start_time,
        doctor.end_time,
        doctor.days_of_week,
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
      const sql =
        "UPDATE doctors SET full_name=COALESCE($1,full_name), email=COALESCE($2,email), phone=COALESCE($3,phone), password=COALESCE($4,password), image=COALESCE($5,image), clinic_location=COALESCE($6,clinic_location), start_time=COALESCE($7,start_time), end_time=COALESCE($8,end_time), days_of_week=COALESCE($9,days_of_week) where id=($10) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        doctor.full_name,
        doctor.email,
        doctor.phone,
        doctor.password,
        doctor.image,
        doctor.clinic_location,
        doctor.start_time,
        doctor.end_time,
        doctor.days_of_week,
        id,
      ]);
      conn.release();
      if (result.rows.length) return result.rows[0];
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
      const sql = "DELETE FROM doctors WHERE id=($1) RETURNING * ";
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

  async authenticate(username, password) {
    try {
      const sql = "SELECT * FROM doctors WHERE username=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [username]);
      conn.release();
      if (result.rows.length) {
        const doctor = result.rows[0];
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, doctor.password))
          return doctor;
      }
    } catch (error) {
      throw new Error(error.message);
    }
    return null;
  }
}

module.exports = DoctorStore;
