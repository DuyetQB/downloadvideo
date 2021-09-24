const express = require("express");
const UserDownload = require("../Controller/index");
const router = require("express-promise-router")();
router.get("/", UserDownload.download);

module.exports = router;
