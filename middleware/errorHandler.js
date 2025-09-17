export default function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? "Internal server error" : err.message,
  });
}
