const PostStore = require("../models/post");
const store = new PostStore();
const { successRes, errorRes } = require("../services/response");
const { deleteFile } = require("../services/helpers");

const index = async (req, res, next) => {
  try {
    if (!res.data)
      return res.status(400).json(errorRes(400, "Nothing exits", null));
    res
      .status(200)
      .json(
        successRes(
          200,
          res.data,
          "Posts fetched successfully",
          res.paginatedResult
        )
      );
  } catch (error) {
    if (error.code)
      return res
        .status(error.code)
        .json(errorRes(error.code, error.message, null));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message, null));
    }
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const post = await store.show(req.params.post_id);
    res.status(200).json(successRes(200, post, "Post fetched successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const create = async (req, res, next) => {
  const post = {
    user_id: req.userId,
    body: req.body.body,
    private: req.body.private === "true" || req.body.private === "True",
  };
  try {
    // if(req.file){
    //   let path = [];
    //   path.push(req.file.path)
    //   post.file = path;
    // }
    if (!post.body) {
      const error = new Error("Post's body is missing");
      error.code = 422;
      throw error;
    }
    if (req.files.length) {
      let path = [];
      req.files.map((file) => {
        path.push(`${file.path}`);
      });
      post.file = path;
    }
    const imagetypes = /jpeg|jpg|png/;
    const filetypes = /pdf|doc|txt/;
    const file = req.files.length && req.files[0].mimetype;
    if (!file) post.type = "text_only";
    else if (req.files.length === 1) {
      if (imagetypes.test(file)) post.type = "text_with_image";
      else if (filetypes.test(file)) post.type = "text_with_file";
    } else if (req.files.length > 1 && imagetypes.test(file))
      post.type = "text_with_album";

    await store.create(post);
    res.status(200).json(successRes(200, null, "Post created successfully."));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};
const update = async (req, res, next) => {
  const post = {
    body: req.body.body,
  };

  if (req.files.length) {
    let path = [];
    req.files.map((file) => {
      path.push(`${file.path}`);
    });
    post.file = path;
  }
  try {
    if (!post.body) {
      const error = new Error("Post's body is missing");
      error.code = 422;
      throw error;
    }
    const { user_id } = await store.show(req.params.post_id);
    if (user_id !== req.userId) {
      const error = new Error("Not Authorized!");
      error.code = 401;
      throw error;
    }
    await store.update(post, req.params.post_id);
    res.status(200).json(successRes(200, null, "Post is updated successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { user_id } = await store.show(req.params.post_id);
    if (user_id !== req.userId) {
      const error = new Error("Not Authorized!");
      error.code = 401;
      throw error;
    }
    const post = await store.delete(req.params.post_id);
    if (post.file) {
      const str = post.file[0];
      deleteFile(str.substring(str.indexOf("upload")));
    }
    res.status(200).json(successRes(200, null, "Post is deleted successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const showPostsBelongToUser = async (req, res, next) => {
  try {
    const posts = await store.showPostsBelongToUser(req.userId);
    res.status(200).json(successRes(200, posts, "Posts fetched successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  remove,
  showPostsBelongToUser,
};
