const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL_PAYMENT,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để xử lý request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm logic trước khi gửi request (nếu cần)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
axiosInstance.interceptors.response.use(
  (response) => {
    // Xử lý response thành công
    return response;
  },
  (error) => {
    // Xử lý lỗi từ server
    return Promise.reject(error);
  }
);

module.exports = axiosInstance;
