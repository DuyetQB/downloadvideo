const express = require("express");
const UserDownload = require("../Controller/index");
const router = require("express-promise-router")();
// router.get("/", UserDownload.download);

router.route("/").get(UserDownload.get);
router.route("/:url").get(UserDownload.download);
module.exports = router;
