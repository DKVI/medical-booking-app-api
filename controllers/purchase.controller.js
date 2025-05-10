const PurchaseModel = require("../models/purchase.model");

const purchaseController = {
  getAll: async (req, res) => {
    try {
      const result = await PurchaseModel.getAll();
      console.log(result);
      if (result.length !== 0) {
        return res.status(200).json({ success: true, purchases: result });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "not found any items" });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  confirmPurchase: async (req, res) => {
    try {
      const result = await PurchaseModel.confirmPurchase(
        req.body.schedulingDetailId
      );
      if (result.affectedRows !== 0) {
        return res
          .status(200)
          .json({ success: true, message: "purchase approved" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "not found scheduling detail" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "server got some error" });
    }
  },
  getPurchase: async (req, res) => {
    try {
      const result = await PurchaseModel.getPurchase(
        req.body.schedulingDetailId
      );
      return res.status(200).json({ success: true, purchase: result[0] });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "server got some error" });
    }
  },
};

module.exports = purchaseController;
