const express = require("express");
const router = express.Router();
const { fileUploadd } = require("../services/upload");

const postController = require("../controllers/posts.controller");
const verifyAuthToken = require("../services/auth");
const postStore = require("../models/post");
const {pagination} = require("../services/middleware");

const store = new postStore();

router.get("/", verifyAuthToken, pagination(store), postController.index);
router.get("/:post_id", verifyAuthToken, postController.show);
router.put("/:post_id", verifyAuthToken, fileUploadd("file"), postController.update);
router.delete("/:post_id", verifyAuthToken, postController.remove);
router.post("/:user_id", verifyAuthToken, fileUploadd("file"), postController.create);

module.exports = router;
