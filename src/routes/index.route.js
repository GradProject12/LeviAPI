const express = require("express");
const admins = require("./admins.route");
const animals = require("./animals.route");
const expressions = require("./expressions.route");
const colors = require("./colors.route");

const router = express.Router();

router.use("/api/animals", animals);
router.use("/api/admins", admins);
router.use("/api/expressions", expressions);
router.use("/api/colors", colors);

module.exports = router;
