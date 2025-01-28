// Load environment variables
import "dotenv/config";

// Import dependencies
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { server } from "./src/config/config-server.js";
import { router } from "./src/routers/index.router.js";
import { bodySanitizerMiddleware } from "./src/middlewares/body-sanitizer.js";
import { logger } from "./src/lib/logger.js";
import { errorHandler } from "./src/middlewares/error-handler.middleware.js";

// Create app
const app = express();

//TODO Modification EN PROD
// Authorize CORS requests 
app.use(cors("*"));

// Disable x-powered-by Express header // => ne pas leak des informations sur notre stack technique
app.disable('x-powered-by');

// Add body parser
app.use(express.urlencoded({ extended: true })); // Parser les bodies de type "application/www-form-urlencoded"
app.use(express.json()); // Parser les bodies de type "application/json"

// Cookie parser
app.use(cookieParser());

// Static assets
app.use(express.static("./src/public"));

// Filter out XSS injection from body data
app.use(bodySanitizerMiddleware);

// Configure routes
app.use("/api", router);

// Error middleware
app.use(errorHandler);

// HTTP server
const { protocol, port, host } = server; 
app.listen(port, host, () => {
  logger.info(`🚀 Server listening on ${protocol}://${host}:${port}`);
});

