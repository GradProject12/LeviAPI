const client = require("../database");
const bcrypt = require("bcrypt");
const { stringBetweenParentheses } = require("../services/helpers");

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class DoctorStore {
  async index(params) {
    try {
      const sql = `SELECT
      (SELECT COUNT(*) 
       FROM users
      ) as count, 
      (SELECT json_agg(t.*) FROM (
          SELECT * FROM users
          JOIN doctors on users.user_id=doctors.doctor_id ORDER BY ($1) OFFSET ($2) LIMIT ($3)
      ) AS t) AS rows `;
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

  async showDoctorProfile(id) {
    try {
      const sql =
        `SELECT * FROM (SELECT full_name, email, phone, profile_image, created_at, doctor_id, certificate_image, clinic_location, clinic_phone_number, working_schedule
           FROM users JOIN doctors on users.user_id=doctors.doctor_id) AS users WHERE doctor_id=($1)`;
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
        "INSERT INTO users (full_name, email, phone, password, role, secret) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
      const sql =
        "INSERT INTO doctors(doctor_id, clinic_location, working_schedule,national_id,certificate_image) VALUES($1,$2,$3,$4,$5) RETURNING *";
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
        "doctor",
        doctor.secret,
      ]);
      const newUser = user.rows[0];
      const result = await conn.query(sql, [
        newUser.user_id,
        doctor.clinic_location,
        doctor.working_schedule,
        doctor.national_id,
        doctor.certificate_image,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505")
        throw new Error(
          `${stringBetweenParentheses(error.detail)} already exists`
        );
      if (error.code === "23502") throw new Error(`${error.column} is null`);
      if (error.code === "22P02")
        throw new Error(`working schedule is not vaild`);

      throw new Error(error.message);
    }
  }

  async update(doctor, id) {
    try {
      const updateUser =
        "UPDATE  users SET email=COALESCE($1,email), phone=COALESCE($2,phone), profile_image=COALESCE($3,profile_image) WHERE user_id=($4) RETURNING *";
      const updateDoctor =
        "UPDATE doctors SET clinic_location=COALESCE($1,clinic_location),  working_schedule=COALESCE($2,working_schedule) where doctor_id=($3) RETURNING * ";
      const conn = await client.connect();
      const result1 = await conn.query(updateUser, [
        doctor.email,
        doctor.phone,
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
      if (error.code === "22P02" && error.routine==='json_ereport_error') throw new Error(`Working Schedule mus be of type json`);
      if (error.code === "22P02") throw new Error(`id must be integer`);
      console.log(error)

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

  async isAccepted(email) {
    try {
      const sql =
        "SELECT accepted_status FROM (SELECT * FROM users JOIN doctors on users.user_id=doctors.doctor_id) AS users WHERE email=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("doctor is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }

  async showParentsBelongsToDoctor(doctor_id) {
    try {
      const sql = `
          SELECT full_name,email,phone,profile_image,parent_id FROM users
          JOIN parents on users.user_id=parents.parent_id WHERE parents.doctor_id=($1) `;
      const conn = await client.connect();
      const result = await conn.query(sql, [doctor_id]);
      conn.release();
      if (result.rows.length) return result.rows;
      else throw new Error("No parents found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }

  async addParentToDoctor(doctor_id, parent_email) {
    try {
      const sql = `UPDATE parents
      SET doctor_id = ($1)
      FROM users
      WHERE parents.parent_id = users.user_id AND users.email=($2) RETURNING *;`;
      const conn = await client.connect();
      const result = await conn.query(sql, [doctor_id, parent_email]);
      conn.release();
      if (result.rows.length) return result.rows;
      else throw new Error("Email or something is wrong");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }

  async checkIfParentIsAdded(parent_email) {
    try {
      const sql = `SELECT doctor_id FROM parents AS p JOIN users AS u ON p.parent_id=u.user_id WHERE u.email=($1)`;
      const conn = await client.connect();
      const result = await conn.query(sql, [parent_email]);
      conn.release();
      if (result.rows[0].doctor_id) return true;
      return false;
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
}

module.exports = DoctorStore;
