const client = require("../database");
const { stringBetweenParentheses } = require("../services/helpers");

class PostStore {
  async index() {
    try {
      const sql = "SELECT * FROM posts";
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async show(post_id) {
    try {
      const sql = "SELECT * FROM posts WHERE post_id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [post_id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("post is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
  async create(post) {
    try {
      const sql1 =
        "INSERT INTO assets(user_id, type) VALUES($1, $2) RETURNING *";
      const sql2 =
        "INSERT INTO posts(post_id,body,file,type) VALUES($1, $2,$3,$4) RETURNING *";
      const conn = await client.connect();
      const result1 = await conn.query(sql1, [post.user_id, "post"]);
      const result2 = await conn.query(sql2, [
        result1.rows[0].asset_id,
        post.body,
        post.file,
        post.type,
      ]);
      conn.release();
      return result2.rows[0];
    } catch (error) {
      if (error.code === "23505")
        throw new Error(
          `${stringBetweenParentheses(error.detail)} already exists`
        );
      if (error.code === "23502") throw new Error(`${error.column} is null`);

      throw new Error(error.message);
    }
  }

  async update(post, post_id) {
    try {
      const sql =
        "UPDATE posts SET body=COALESCE($1,body),file=COALESCE($2,file) where post_id=($3) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [post.body, post.file, post_id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("post is not found");
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
  async delete(post_id) {
    try {
      const sql = "DELETE FROM posts WHERE post_id=($1) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [post_id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("post is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
}

module.exports = PostStore;
