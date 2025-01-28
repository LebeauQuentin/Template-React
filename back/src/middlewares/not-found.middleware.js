import { NotFoundError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";

export function notFoundMiddleware(req, res, next) {
  // Log for debugging purposes
  logger.debug(req);

  // Let the global error handler respond to the client
  next(new NotFoundError("Resource not found"));
}
