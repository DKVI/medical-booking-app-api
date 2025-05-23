const express = require("express");
const { uploadAvatar } = require("../controllers/patient.controller");

const router = express.Router();

router.post("/upload-avatar", uploadAvatar);

module.exports = router;
