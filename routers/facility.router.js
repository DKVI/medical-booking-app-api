const express = require("express");
const facilityController = require("../controllers/facility.controller");

const router = express.Router();

// Định nghĩa các route cho facility
router.post("/", facilityController.create); // Tạo mới facility
router.get("/", facilityController.getAll); // Lấy danh sách tất cả facility
router.get("/:id", facilityController.getById); // Lấy thông tin facility theo ID
router.put("/:id", facilityController.update); // Cập nhật facility theo ID
router.delete("/:id", facilityController.delete); // Xóa facility theo ID

module.exports = router;
