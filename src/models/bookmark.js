const client = require("../database");
const { stringBetweenParentheses } = require("../services/helpers");

class BookmarkStore {
  async fetchAllBookmarks(user_id, type) {
    try {
      const conn = await client.connect();
      let sql = "";
      if (type === "message")
        sql =
          "SELECT mes.profile_image,mes.full_name,ass.user_id,count(ass.user_id) FROM (SELECT * FROM messages AS mes JOIN assets AS ass ON mes.message_id=ass.asset_id JOIN users AS us ON us.user_id=ass.user_id ) AS mes JOIN assets AS ass ON mes.message_id=ass.asset_id JOIN bookmarks AS bk ON mes.message_id=bk.asset_id WHERE bk.user_id=($1) GROUP BY mes.profile_image,mes.full_name,ass.user_id";
      else if (type === "post")
        sql =
          "SELECT us.profile_image,pos.body,pos.created_at,us.full_name FROM posts AS pos JOIN bookmarks AS bk ON pos.post_id=bk.asset_id JOIN assets AS ass ON bk.asset_id=ass.asset_id JOIN users AS us ON us.user_id=ass.user_id WHERE bk.user_id=($1)";
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async showRelatedMessagesToBookmarkedUser(loggedUser, bokmarkedUser) {
    try {
      const sql =
        "SELECT mes.body,mes.message_id FROM (SELECT message_id,body,mes.created_at FROM messages AS mes JOIN assets AS ass ON mes.message_id=ass.asset_id JOIN users AS us ON us.user_id=ass.user_id ) AS mes JOIN assets AS ass ON mes.message_id=ass.asset_id JOIN bookmarks AS bk ON mes.message_id=bk.asset_id WHERE bk.user_id=($1) AND ass.user_id=($2) ORDER BY mes.created_at DESC";
      const conn = await client.connect();
      const result = await conn.query(sql, [loggedUser, bokmarkedUser]);
      conn.release();
      if (result.rows.length) return result.rows;
      else throw new Error("messages are not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }

  async addToBookmark(user_id, asset_id) {
    try {
      const sql =
        "INSERT INTO bookmarks(user_id,asset_id) VALUES($1,$2) RETURNING *";
      // console.log(user_id)
      // console.log(asset_id)
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id, asset_id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505")
        throw new Error(`Item already exists in bookmark`);
      if (error.code === "23502") throw new Error(`${error.column} is null`);
      if (error.code === "23503") throw new Error(`Item doesn't exist`);

      throw new Error(error.message);
    }
  }

  async deleteBookmark(user_id, asset_id) {
    try {
      const sql =
        "DELETE FROM bookmarks WHERE user_id=($1) AND asset_id=($2) RETURNING * ";
      const conn = await client.connect();
      const result = await conn.query(sql, [user_id, asset_id]);
      conn.release();
      if (result.rows.length) return result.rows[0];
      else throw new Error("bookmark is not found");
    } catch (error) {
      if (error.code === "22P02") throw new Error(`id must be integer`);
      throw new Error(error.message);
    }
  }
}

module.exports = BookmarkStore;
