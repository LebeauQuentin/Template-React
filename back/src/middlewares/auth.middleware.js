import { UnauthorizedError } from "../lib/errors.js";
import { verifyJwtToken } from "../lib/tokens.js";
import { auth } from '../config/config-auth.js';


export function isAuthenticated(req, _, next) {
  try {

    // Retrieve user data from token payload, cache and/or database.
    const payload = authentify(req);

    // Because this middleware is often used, we avoid fetching all user data systematically in database. The userId should be enough to retrieve information in the following controllers
    const userId = payload.userId; 
    
    // Append user data to req object to be used in following middlewares
    req.userId = userId;

    // Call next middlewares
    next();

  } catch (error) {
    next(error);
  }
}

export function authentify(req) {
  // Get access token from either cookies (browsers) or Authorization headers (any service)
  const authorizationHeaders = req.headers?.["Authorization"] || req.headers?.["authorization"];
  const accessToken = req.cookies?.["x-auth-token"] || authorizationHeaders?.split("Bearer ")[1];
  if (! accessToken) { throw new UnauthorizedError("No access token provided in request headers"); }

  // Verify token authenticity and validity
  const decodedToken = verifyJwtToken(accessToken);
  if (! decodedToken) { throw (new UnauthorizedError("Invalid or expired access token")); }
  
  // Optional CSRF validation
  if (auth.preventCSRF) {
    const csrfToken = req.headers?.["x-csrf-token"];
    if (! csrfToken) { throw new UnauthorizedError("No csrf token provided in request headers"); }

    if (decodedToken.csrfToken !== csrfToken) { throw new UnauthorizedError("Bad CSRF token provided"); }
  }

  // Return token payload
  return decodedToken;
}

