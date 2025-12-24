const jwt = require("jsonwebtoken");
const { ERROR_MESSAGES } = require("../config/constants");
const { RESPONSE_FORMAT } = require("../config/app");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Map SQL error numbers to user-friendly messages
const SQL_ERROR_MAP = {
  2: ERROR_MESSAGES.DATABASE_ERROR, // Timeout
  18: ERROR_MESSAGES.DATABASE_ERROR, // Login failed
  2627: "Dữ liệu đã tồn tại trong hệ thống",
  547: "Không thể xóa do có dữ liệu liên quan",
  515: "Thiếu thông tin bắt buộc",
  544: "Không thể chèn giá trị NULL",
  8152: "Dữ liệu vượt quá độ dài cho phép",
  245: "Lỗi chuyển đổi kiểu dữ liệu",
  50001: "Lỗi nghiệp vụ từ stored procedure",
};

const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method,
    user: req.user
      ? {
          userId: req.user.MaNV,
          role: req.user.role || req.user.VaiTro,
        }
      : "anonymous",
  });

  // SQL Server errors
  if (err.number) {
    const message = SQL_ERROR_MAP[err.number] || ERROR_MESSAGES.DATABASE_ERROR;
    return res.status(400).json(
      RESPONSE_FORMAT.error(message, 400, {
        code: err.number,
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      })
    );
  }

  // Validation errors (từ Joi hoặc custom validation)
  if (err.name === "ValidationError" || err.isJoi) {
    const message = err.details
      ? err.details.map((detail) => detail.message).join(", ")
      : err.message;
    return res.status(400).json(RESPONSE_FORMAT.error(message, 400));
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json(RESPONSE_FORMAT.error(ERROR_MESSAGES.INVALID_TOKEN, 401));
  }

  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json(RESPONSE_FORMAT.error(ERROR_MESSAGES.TOKEN_EXPIRED, 401));
  }

  // Custom business logic errors (AppError)
  if (err.isOperational || err.statusCode) {
    return res
      .status(err.statusCode)
      .json(RESPONSE_FORMAT.error(err.message, err.statusCode));
  }

  // Default server error
  res.status(500).json(
    RESPONSE_FORMAT.error(
      ERROR_MESSAGES.SERVER_ERROR,
      500,
      process.env.NODE_ENV === "development"
        ? {
            message: err.message,
            stack: err.stack,
          }
        : undefined
    )
  );
};

module.exports = {
  errorHandler,
  AppError,
  SQL_ERROR_MAP,
};
