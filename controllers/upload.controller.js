const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const patientController = require("./patient.controller");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../public/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Controller upload và crop ảnh vuông
const uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }
      const inputPath = req.file.path;
      const outputPath = path.join(
        path.dirname(inputPath),
        "cropped_" + req.file.filename
      );

      // Crop hình vuông
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      const size = Math.min(metadata.width, metadata.height);

      await image
        .extract({ left: 0, top: 0, width: size, height: size })
        .toFile(outputPath);

      // Trả về đường dẫn ảnh đã crop
      const avatarUrl = `/public/avatars/cropped_${req.file.filename}`;
      res.status(200).json({ success: true, avatarUrl });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

module.exports = uploadAvatar;
