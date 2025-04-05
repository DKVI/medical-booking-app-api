const express = require("express");
const PaymentController = require("../controllers/payment.controller");

const router = express.Router();

router.post("/getTokenPayPal", PaymentController.getPayPalAccessToken);
router.post("/checkout", PaymentController.createPayment);
router.get("/checkStatus", PaymentController.checkStatus);
module.exports = router;
