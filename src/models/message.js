const client = require("../database");
const { stringBetweenParentheses } = require("../services/helpers");

class MessageStore {
  async getAllMessage(chat_id) {
    try {
      const sql = `SELECT m.message_id,m.body,m.read,m.user_id,m.read_at,m.created_at,
        u.full_name,u.profile_image FROM messages m
        JOIN users u ON u.user_id=m.user_id
        WHERE chat_id=($1) ORDER BY m.created_at DESC`;
      const conn = await client.connect();
      const result = await conn.query(sql, [chat_id]);
      conn.release();
      if (result.rows.length) return result.rows;
      else throw new Error("There is no messages exist");
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllChats(user_id) {
    try {
      const sql = `SELECT c.chat_id,c.name FROM participants p
        JOIN chats c ON p.chat_id=c.chat_id
        WHERE user_id=($1) `;
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id]);
      conn.release();
      if (result.rows.length) return result.rows;
      else throw new Error("No chats exist");
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createChat(received_user) {
    try {
      const sql = "INSERT INTO chats(name) VALUES($1) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [received_user]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addParticipants(params) {
    try {
      const sql =
        "INSERT INTO participants(user_id,chat_id) VALUES($1,$3),($2,$3) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        params.sender,
        params.reciver,
        params.chat_id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      if (error.code === "23503") throw new Error(`User doesn't exist`);

      throw new Error(error.message);
    }
  }

  async checkIfChatExist(user1, user2) {
    try {
      const sql = `select chat_id
      from participants p
      group by chat_id
      having array_agg(p.user_id order by p.user_id) = array[($1)::integer,($2)::integer]
      OR array_agg(p.user_id order by p.user_id) = array[($2)::integer,($1)::integer]
      `;
      const conn = await client.connect();
      const result = await conn.query(sql, [+user1, +user2]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendMessage(params) {
    try {
      const sql =
        "INSERT INTO messages(body, chat_id,user_id ) VALUES($1, $2,$3) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        params.body,
        params.chat_id,
        params.sender,
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

  // async deleteMessage(animal, id) {
  //   try {
  //     const sql =
  //       "UPDATE messages SET name=COALESCE($1,name), picture=COALESCE($2,picture), sound=COALESCE($3,sound), spelled=COALESCE($4,spelled) where animal_id=($5) RETURNING * ";
  //     const conn = await client.connect();
  //     const result = await conn.query(sql, [
  //       animal.name,
  //       animal.picture,
  //       animal.sound,
  //       animal.spelled,
  //       id,
  //     ]);
  //     conn.release();
  //     if (result.rows.length) return result.rows[0];
  //     else throw new Error("Animal is not found");
  //   } catch (error) {
  //     if (error.code === "22P02") throw new Error(`ID must be integer`);

  //     if (error.code === "23505")
  //       throw new Error(
  //         `${stringBetweenParentheses(error.detail)} already exists`
  //       );
  //     if (error.code === "23502") throw new Error(`${error.column} is null`);

  //     throw new Error(error.message);
  //   }
  // }
  // async delete(id) {
  //   try {
  //     const sql = "DELETE FROM animals WHERE animal_id=($1) RETURNING * ";
  //     const conn = await client.connect();
  //     const result = await conn.query(sql, [id]);
  //     conn.release();
  //     if (result.rows.length) return result.rows[0];
  //     else throw new Error("Animal is not found");
  //   } catch (error) {
  //     if (error.code === "22P02") throw new Error(`ID must be integer`);
  //     throw new Error(error.message);
  //   }
  // }
}

module.exports = MessageStore;
