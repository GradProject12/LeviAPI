const BookmarkStore = require("../models/bookmark");
const store = new BookmarkStore();
const { successRes, errorRes } = require("../services/response");

const fetchAllBookmarks = async (req, res) => {
  const { user_id, type } = req.params;
  try {
    if (!(type === "message" || type === "post"))
      throw new Error("Boomark type is invaild");
    const bookmarks = await store.fetchAllBookmarks(user_id, type);
    res.status(200).json(successRes(200, bookmarks,"Bookmark fetched successfully"));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const showRelatedMessagesToBookmarkedUser = async (req, res) => {
  const { user_id, bookmarked_user } = req.params;
  try {
    const bookmark = await store.showRelatedMessagesToBookmarkedUser(
      user_id,
      bookmarked_user
    );
    res.status(200).json(successRes(200, bookmark,"User's messages fetched successfully"));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const addToBookmark = async (req, res) => {
  try {
    if (!req.body.asset_id) throw new Error("Asset is missing");
    await store.addToBookmark(req.params.user_id, req.body.asset_id);
    res
      .status(201)
      .json(successRes(201, null, "Added to bookmark successfully."));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

const deleteBookmark = async (req, res) => {
  try {
    if (!req.body.asset_id) throw new Error("Asset is missing");
    await store.deleteBookmark(req.params.user_id, req.body.asset_id);
    res
      .status(200)
      .json(successRes(200, null, "Removed from bookmark successfully."));
  } catch (error) {
    res.status(404);
    res.json(errorRes(404, error.message));
  }
};

module.exports = {
  fetchAllBookmarks,
  showRelatedMessagesToBookmarkedUser,
  addToBookmark,
  deleteBookmark,
};
