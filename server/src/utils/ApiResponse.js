export class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export const sendResponse = (res, apiResponse) => {
  return res.status(apiResponse.statusCode).json(apiResponse);
};
