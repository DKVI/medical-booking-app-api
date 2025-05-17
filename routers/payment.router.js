const express = require("express");
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

router.post("/getTokenPayPal", paymentController.getPayPalAccessToken);
router.post("/checkout", paymentController.createPayment);
router.get("/checkStatus", paymentController.checkStatus);
module.exports = router;

