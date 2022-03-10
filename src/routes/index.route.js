const express = require("express");
const users = require("./users.route");
const animals = require("./animals.route");
const expressions = require("./expressions.route");

const router = express.Router();

router.use("/api/animals", animals);
router.use("/api/users", users);
router.use("/api/expressions", expressions);

module.exports = router;
