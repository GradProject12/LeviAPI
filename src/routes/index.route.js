const express = require("express");
const admins = require("./admins.route");
const animals = require("./animals.route");
const expressions = require("./expressions.route");
const colors = require("./colors.route");
const doctors = require("./doctors.route");
const parents = require("./parents.route");
const robots = require("./robots.route");
const bookmarks = require("./bookmarks.route");
const posts = require("./posts.route");
const auth = require("./auth.route");
const analyses = require("./analyses.route");

const path = require("path");
const fs = require("fs");
const pr = require("util")

const router = express.Router();

router.use("/api/animals", animals);
router.use("/api/admins", admins);
router.use("/api/expressions", expressions);
router.use("/api/colors", colors);
router.use("/api/doctors", doctors);
router.use("/api/parents", parents);
router.use("/api/robots", robots);
router.use("/api/bookmarks", bookmarks);
router.use("/api/posts", posts);
router.use("/api/analyses", analyses);
router.use("/api/", auth);


const test = async (req,res) => {
    const arr=[]
    const readdirAsync = pr.promisify(fs.readdir);
	const models = await readdirAsync('./uploads');
	for (let file of models) {
        arr.push(file)
	}
	return res.json(arr)
};
router.get("/api/test",test)

module.exports = router;
