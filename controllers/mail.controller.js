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
      const { to, subject, body } = req.body;
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        text: body,
      });
      res.status(200).json({ message: "Email sent successfully" });
      console.log(info.message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error sending email" });
    }
  },
};

module.exports = mailController;
