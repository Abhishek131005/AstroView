/**
 * Custom Error Classes
 */

export class APIError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

export class ValidationError extends APIError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends APIError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends APIError {
  constructor(message = 'Rate limit exceeded', retryAfter = null) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ExternalAPIError extends APIError {
  constructor(message, apiName, status = 502) {
    super(message, status);
    this.name = 'ExternalAPIError';
    this.apiName = apiName;
  }
}

/**
 * Error Handler Middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('━'.repeat(60));
  console.error('ERROR:', err.name || 'Error');
  console.error('Message:', err.message);
  console.error('Path:', req.method, req.path);
  console.error('Time:', new Date().toISOString());
  
  if (err.stack && process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }
  console.error('━'.repeat(60));

  // Handle specific error types
  if (err instanceof APIError) {
    const response = {
      error: err.name,
      message: err.message,
    };

    // Add additional details for specific errors
    if (err.details) {
      response.details = err.details;
    }

    if (err instanceof RateLimitError && err.retryAfter) {
      res.setHeader('Retry-After', err.retryAfter);
      response.retryAfter = err.retryAfter;
    }

    if (err instanceof ExternalAPIError) {
      response.apiName = err.apiName;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    return res.status(err.status).json(response);
  }

  // Handle Axios errors from external APIs
  if (err.response) {
    const apiError = new ExternalAPIError(
      err.response.data?.message || err.message || 'External API error',
      err.config?.baseURL || 'Unknown API',
      err.response.status
    );

    return res.status(apiError.status).json({
      error: apiError.name,
      message: apiError.message,
      apiName: apiError.apiName,
      statusCode: err.response.status,
      ...(process.env.NODE_ENV === 'development' && { 
        originalError: err.response.data,
        stack: err.stack 
      })
    });
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'ValidationError',
      message: err.message,
      details: err.errors || null,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Default error response for unknown errors
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: err.name || 'Error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  });
};

/**
 * Async error wrapper for route handlers
 * Catches async errors and passes them to error handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found Handler
 * Should be placed after all routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Cannot ${req.method} ${req.path}`);
  next(error);
};
