const BookmarkStore = require("../models/bookmark");
const store = new BookmarkStore();
const { successRes, errorRes } = require("../services/response");

const fetchAllBookmarks = async (req, res, next) => {
  const { type } = req.params;
  try {
    if (!(type === "message" || type === "post"))
      throw new Error("Boomark type is invaild");
    const bookmarks = await store.fetchAllBookmarks(req.userId, type);
    res
      .status(200)
      .json(successRes(200, bookmarks, "Bookmark fetched successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const showRelatedMessagesToBookmarkedUser = async (req, res, next) => {
  const { bookmarked_user } = req.params;
  try {
    const bookmark = await store.showRelatedMessagesToBookmarkedUser(
      req.userId,
      bookmarked_user
    );
    res
      .status(200)
      .json(successRes(200, bookmark, "User's messages fetched successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const addToBookmark = async (req, res, next) => {
  try {
    if (!req.body.asset_id) throw new Error("Asset is missing");
    await store.addToBookmark(req.userId, req.body.asset_id);
    res
      .status(201)
      .json(successRes(201, null, "Added to bookmark successfully."));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const deleteBookmark = async (req, res, next) => {
  try {
    if (!req.body.asset_id) throw new Error("Asset is missing");
    await store.deleteBookmark(req.userId, req.body.asset_id);
    res
      .status(200)
      .json(successRes(200, null, "Removed from bookmark successfully."));
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
  fetchAllBookmarks,
  showRelatedMessagesToBookmarkedUser,
  addToBookmark,
  deleteBookmark,
};
