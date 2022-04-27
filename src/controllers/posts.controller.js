const PostStore = require("../models/post");
const store = new PostStore();
const { successRes, errorRes } = require("../services/response");
const { deleteFile } = require("../services/helpers");

const index = async (req, res) => {
  try {
    const posts = await store.index();
    res.status(200).json(successRes(200, posts));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const show = async (req, res) => {
  try {
    const post = await store.show(req.params.post_id);
    res.status(200).json(successRes(200, post));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const create = async (req, res) => {
  const post = {
    user_id: req.params.user_id,
    body: req.body.body,
  };
  if (req.files.length) {
    let path = [];
    req.files.map((file) => {
      path.push(`http://${req.headers.host}/${file.path}`);
    });
    post.file = path;
  }
  try {
    if (!post.body) {
      const error = new Error("Post's body is missing");
      error.code = 422;
      throw error;
    }
    // if (req.files.length) {
    //   // if (post.file.length === 1 &&) post.type = "text_with";
    // } else
    post.type = "text_only";

    const newpost = await store.create(post);
    res.status(200).json(successRes(200, newpost));
  } catch (error) {
    error.code &&
      res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};
const update = async (req, res) => {
  const post = {
    body: req.body.body,
  };

  if (req.files.length) {
    let path = [];
    req.files.map((file) => {
      path.push(`http://${req.headers.host}/${file.path}`);
    });
    post.file = path;
  }
  try {
    if (!post.body) {
      const error = new Error("Post's body is missing");
      error.code = 422;
      throw error;
    }
    await store.update(post, req.params.post_id);
    res.status(200).json(successRes(200, null, "Post is updated successfully"));
  } catch (error) {
    error.code &&
      res.status(error.code).json(errorRes(error.code, error.message));
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const post = await store.delete(req.params.post_id);
    const str = post.file[0];
    deleteFile(str.substring(str.indexOf("upload")));
    res.status(200).json(successRes(200, null, "Post is deleted successfully"));
  } catch (error) {
    res.status(400);
    res.json(errorRes(400, error.message));
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
