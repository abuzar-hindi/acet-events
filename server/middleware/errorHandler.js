// middleware/errorHandler.js
// Global express error handler
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err.message || err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Signature file is too large (max 2 MB).' });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'An unexpected server error occurred.',
  });
};

module.exports = errorHandler;
