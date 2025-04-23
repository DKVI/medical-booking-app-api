const express = require("express");
const cors = require("cors"); // Import cors
const app = express();

app.use(express.json());

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
  })
);

const PORT = 3000;
const specialRouter = require("./routers/specialty.router");
const paymentRouter = require("./routers/payment.router");
const mailRouter = require("./routers/mail.router");
const authenRouter = require("./routers/authen.router");
const facilityRouter = require("./routers/facility.router");
const doctorRouter = require("./routers/doctor.router");
const workScheduleRouter = require("./routers/workschedule.router");
app.use("/api/v1/specialty", specialRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/mail", mailRouter);
app.use("/api/v1/authen", authenRouter);
app.use("/api/v1/facility", facilityRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/workschedule", workScheduleRouter);
app.get("/return_order", () => {
  console.log("Order returned successfully.");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
