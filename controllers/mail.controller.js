const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const mailController = {
  sendEmail: async (req, res) => {
    try {
      const { to, subject, body, html } = req.body; // Nhận thêm thuộc tính `html` từ request body
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        text: body, // Nội dung dạng text
        html: html, // Nội dung dạng HTML
      });
      res.status(200).json({ message: "Email sent successfully" });
      console.log(info.messageId); // Log ID của email đã gửi
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = mailController;
