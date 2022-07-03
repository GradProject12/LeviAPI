const express = require("express");
const router = express.Router();
const { uploadFinal } = require("../services/upload");

const postController = require("../controllers/posts.controller");
const verifyAuthToken = require("../services/auth");
const postStore = require("../models/post");
const {pagination} = require("../services/middleware");


const store = new postStore();

router.get("/", verifyAuthToken, pagination(store), postController.index);
router.get("/:post_id", verifyAuthToken, postController.show);
router.get("/user/:user_id", verifyAuthToken, postController.showPostsBelongToUser);
router.put("/:post_id", verifyAuthToken, uploadFinal("file"), postController.update);
router.delete("/:post_id", verifyAuthToken, postController.remove);
router.post("/:user_id", verifyAuthToken, uploadFinal("file"), postController.create);

module.exports = router;
