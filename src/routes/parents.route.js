const express = require("express");
const router = express.Router();

const parentController = require("../controllers/parents.controller");
const verifyAuthToken = require("../services/auth");
const parentStore = require("../models/parent");
const { pagination } = require("../services/middleware");

const store = new parentStore();

router.get("/", verifyAuthToken, pagination(store), parentController.index);
router.get("/:id", verifyAuthToken, parentController.show);
router.put("/:id", verifyAuthToken, parentController.update);
router.delete("/:id", verifyAuthToken, parentController.remove);

module.exports = router;
