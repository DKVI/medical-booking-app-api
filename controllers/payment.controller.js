const axiosInstance = require("../axios/index.js");
const Buffer = require("buffer").Buffer;
const username = process.env.PAYPAL_USERNAME;
const password = process.env.PAYPAL_PASSWORD;

const auth = Buffer.from(`${username}:${password}`).toString("base64");
const PaymentController = {
  getPayPalAccessToken: async (req, res) => {
    try {
      const response = await axiosInstance.post(
        "/v1/oauth2/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error(
        "Lỗi khi lấy Access Token:",
        error.response?.data || error.message
      );
      throw new Error("Không thể lấy Access Token từ PayPal.");
    }
  },
  createPayment: async (req, res) => {
    try {
      const response = await axiosInstance.post(
        "/v2/checkout/orders",
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: req.body.amount,
              },
              payee: {
                email_address: req.body.email,
              },
            },
          ],
          application_context: {
            return_url: "http://localhost:3000/complete_order",
            cancel_url: "http://localhost:3000/return_order",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${req.body.accessToken}`,
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  checkStatus: async (req, res) => {
    try {
      const response = await axiosInstance.get(
        `/v2/checkout/orders/${req.body.id}`,
        {
          headers: {
            Authorization: `Bearer ${req.body.accessToken}`,
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePayment: async (req, res) => {
    // Logic for updating a payment
    //...
  },
  deletePayment: async (req, res) => {
    // Logic for deleting a payment
    //...
  },
};

module.exports = PaymentController;
