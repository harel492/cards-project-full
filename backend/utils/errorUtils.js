
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const createError = (message, statusCode = 500) => {
    return new AppError(message, statusCode);
  };
  

  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  

  const sendResponse = (res, statusCode, data, message) => {
    res.status(statusCode).json({
      success: true,
      message: message || 'Operation successful',
      data
    });
  };
  
  const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
      success: false,
      error: message
    });
  };
  
  module.exports = {
    AppError,
    createError,
    asyncHandler,
    sendResponse,
    sendError
  };