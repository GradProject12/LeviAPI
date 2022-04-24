const express = require("express");
const router = express.Router();

const bookmarkController = require("../controllers/bookmarks.controller");
const verifyAuthToken = require("../services/auth");

router.get(
  "/:user_id/:type",
  verifyAuthToken,
  bookmarkController.fetchAllBookmarks
);
router.get(
  "/:user_id/:bookmarked_user/messages",
  verifyAuthToken,
  bookmarkController.showRelatedMessagesToBookmarkedUser
);
router.post("/:user_id", verifyAuthToken, bookmarkController.addToBookmark);
router.delete("/:user_id", verifyAuthToken, bookmarkController.deleteBookmark);

module.exports = router;
