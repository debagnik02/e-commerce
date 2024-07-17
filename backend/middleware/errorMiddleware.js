const handleNotFound = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const handleErrors = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    error: {
      message: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    },
  });
};

export { handleNotFound as notFound, handleErrors as errorHandler };
