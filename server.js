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

app.use("/api/v1/specialty", specialRouter);
app.use("/api/v1/payment", paymentRouter);
app.get("/complete_order", (req, res) => {
  res.status(200).json("complete_order");
});
app.get("/return_order", () => {
  console.log("Order returned successfully.");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
