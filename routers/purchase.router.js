const express = require("express");
const purchaseController = require("../controllers/purchase.controller");
const routes = express.Router();

routes.post("/approve", purchaseController.confirmPurchase);
routes.get("/", purchaseController.getAll);
routes.post("/", purchaseController.getPurchase);
module.exports = routes;
