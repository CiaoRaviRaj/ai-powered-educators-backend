export const RESPONSE_STATUS_CODE = {
  OK: 200,
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const COMMON_ERROR_CODE = {
  SUCCESS: "SUC001",
  AUTH401: "AUTH401",
  AUTH404: "AUTH404",
  ATC001: "ATC001",
  ACU400: "ACU400",
};

export const RESPONSE_STATUS_CODE_MESSAGE = {
  OK: "Request successful.",
  CREATED: "Resource created successfully.",
  BAD_REQUEST: "Bad request. Please check your input.",
  UNAUTHORIZED: "Unauthorized. Authentication is required.",
  FORBIDDEN: "Forbidden. You don’t have permission to access this resource.",
  NOT_FOUND: "Resource not found.",
  INTERNAL_SERVER_ERROR: "Internal server error. Please try again later.",
  SERVICE_UNAVAILABLE: "Service unavailable. Please try again later.",
};
