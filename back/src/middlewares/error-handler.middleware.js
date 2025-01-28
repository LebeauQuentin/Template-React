import { HttpClientError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { server } from '../config/config-server.js';

// Error middlewares need to have 4 parameters to work
// eslint-disable-next-line no-unused-vars 
export async function errorHandler(error, _req, res, _next) { 
  
  // 1. Logger : properly log the error with your favorite logger
  logger.error(error);


  // 2. Client errors : send proper API response 
  if (error instanceof HttpClientError) {
    const { message, statusCode, stack } = error;
    res
      .status(statusCode)
      .json({
        statusCode,
        message,
        ...(server.isProd ? {} : { stack }) // Do not include the call stack in production
      });
    return;
  }


  // 3. Server errors : send proper API response
  res
    .status(500)
    .json({
      statusCode: 500,
      message: "Internal server error",
      ...(server.isProd ? {} : { stack: error.stack })
    });
}
