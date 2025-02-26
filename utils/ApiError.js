//Desc : Custom error class for handling API errors responsible about  operation errors  (error that i can predicet)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}
module.exports = ApiError;
