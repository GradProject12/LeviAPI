const PostStore = require("../models/post");
const store = new PostStore();
const { successRes, errorRes } = require("../services/response");

const index = async (req, res) => {
  try {
    const posts = await store.index();
    res.status(200).json(successRes(200, posts));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const show = async (req, res) => {
  try {
    const post = await store.show(req.params.id);
    res.status(200).json(successRes(200, post));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const create = async (req, res) => {
  const post = {
    user_id: req.params.user_id,
    file: req.body.file,
    body: req.body.body,
  };
  console.log(req.files)
  let path = [];
  req.files.map((file) => {
    path.push(`http://${req.headers.host}/${file.path}`);
  });
  post.image = path;
  try {
    if (!post.body) throw new Error("Post's body is missing");
    if (post.file === null && post.image === null) post.type = "text_only";
    else if (post.image.length > 1) post.type = "text_with_album";
    else if (post.file !== null) post.type = "text_with_file";
    else if (post.image.length === 1) post.type = "text_with_image";
    const newpost = await store.create(post);
    res.status(200).json(successRes(200, newpost));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};
const update = async (req, res) => {
  const post = {
    name: req.body.name,
    image: req.body.image,
  };
  try {
    const newpost = await store.update(post, req.params.post_id);
    res.status(200).json(successRes(200, newpost));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const remove = async (req, res) => {
  try {
    const post = await store.delete(req.params.post_id);
    res.status(200).json(successRes(200, post));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
};
