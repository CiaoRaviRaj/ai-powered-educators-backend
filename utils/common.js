export const generateAndSendResponse = ({
  res,
  status,
  data = "",
  message = "",
  error = "",
  errorCode = "",
}) => {
  res.status(status).json({
    status: status,
    errorCode,
    error,
    message,
    data,
  });
};
