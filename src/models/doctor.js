const client = require("../database");
const bcrypt = require("bcrypt");

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
      throw new Error(`Something Wrong ${error}`);
    }
  }

  async show(id) {
    try {
      const sql = "SELECT * FROM doctors WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
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
      throw new Error(`Something Wrong ${error}`);
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
      return result.rows[0];
    } catch (error) {
      throw new Error(`Something Wrong ${error}`);
    }
  }
  async delete(id) {
    try {
      const sql = "DELETE FROM doctors WHERE id=($1) RETURNING * ";
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
      throw new Error(`Something Wrong ${error}`);
    }
    return null;
  }
}

module.exports = DoctorStore;
