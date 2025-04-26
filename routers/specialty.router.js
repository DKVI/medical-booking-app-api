const express = require("express");
const SpecialtyController = require("../controllers/specialty.controller");
const router = express.Router();

router.get("/", SpecialtyController.getAllSpecialties);

router.get("/:id", SpecialtyController.getSpecialtyById);
router.post("/", SpecialtyController.createSpecialty);

router.put("/:id", SpecialtyController.updateSpecialty);

router.delete("/:id", SpecialtyController.deleteSpecialty);

module.exports = router;
