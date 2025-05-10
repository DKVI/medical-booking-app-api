const authenController = require("../controllers/authen.controller");

const express = require("express");
const router = express.Router();

router.post("/register", authenController.createAccount);
router.get("/activation/:token", authenController.activeAccount);
router.post("/login", authenController.login);
router.get("/verify/:token", authenController.verify);
router.get("/getbytoken", authenController.getByToken);
router.post("/change-password", authenController.changePassword);
module.exports = router;
