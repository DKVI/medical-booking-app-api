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
const schedulingDetailRouter = require("./routers/schedulingdetail.router");
const patientRouter = require("./routers/patient.router");
const purchaseRouter = require("./routers/purchase.router");
const prescriptionRouter = require("./routers/prescription.router");
const rateRouter = require("./routers/rate.router");
const medicineRouter = require("./routers/medicine.router");
const mediaRouter = require("./routers/media.router");
app.use("/api/v1/specialty", specialRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/mail", mailRouter);
app.use("/api/v1/authen", authenRouter);
app.use("/api/v1/facility", facilityRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/workschedule", workScheduleRouter);
app.use("/api/v1/schedulingDetail", schedulingDetailRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/prescription", prescriptionRouter);
app.use("/api/v1/rate", rateRouter);
app.use("/api/v1/medicine", medicineRouter);
app.use("/api/v1/media", mediaRouter);

app.use("/public", express.static("public"));
app.get("/complete_order", (req, res) => {
  res.status(200).json({ message: "Order successfully!" });
});
app.get("/return_order", () => {
  console.log("Order returned successfully.");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
