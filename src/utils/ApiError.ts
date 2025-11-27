export class ApiError extends Error {
  public statusCode: number;
  public errorCode?: string;
  public details?: any;

  constructor(
    statusCode: number,
    message: string,
    errorCode: string,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message = "Bad request", details?: any) {
    return new ApiError(400, message, "BAD_REQUEST", details);
  }

  static notFound(message = "Not found", details?: any) {
    return new ApiError(404, message, "NOT_FOUND", details);
  }

  static unauthorized(message = "Unauthorized", details?: any) {
    return new ApiError(401, message, "UNAUTHORIZED", details);
  }

  static forbidden(message = "Forbidden", details?: any) {
    return new ApiError(403, message, "FORBIDDEN", details);
  }

  static internal(message = "Internal server error", details?: any) {
    return new ApiError(500, message, "INTERNAL_ERROR", details);
  }
}
