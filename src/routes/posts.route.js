const express = require("express");
const router = express.Router();
const { upload } = require("../services/helpers");

const postController = require("../controllers/posts.controller");
const verifyAuthToken = require("../services/auth");

router.get("/", verifyAuthToken, postController.index);
router.get("/:post_id", verifyAuthToken, postController.show);
router.put("/:post_id", verifyAuthToken, postController.update);
router.delete("/:post_id", verifyAuthToken, postController.remove);
router.post("/:user_id", verifyAuthToken,upload.single('file'), postController.create);

module.exports = router;
