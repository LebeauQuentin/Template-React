import { z } from "zod";
import { auth } from '../config/config-auth';
import { User, RefreshToken } from "../models/index.model.js";
import { compare, hash, unsaltedHash } from "../lib/crypto.js";
import { generateAuthenticationTokens } from "../lib/tokens.js";
import { BadRequestError, ConflictError, NotFoundError } from "../lib/errors.js";
import { authentify } from "../middlewares/index.middleware.js";
import { logger } from "../lib/logger.js";

// ============================================================
// ====================== USER SIGNUP =========================
// ============================================================

export async function registerUser(req, res) {
  // Body validation
  const { data, error } = await buildSignupBodySchema().safeParseAsync(req.body);
  if (error) { throw new BadRequestError(error.message); }

  const { firstname, lastname, email, password } = data;
  
  // Check if the provided email is already used
  const nbOfUsersWithSameEmail = await User.count({ where: { email }});
  if (nbOfUsersWithSameEmail !== 0) { throw new ConflictError("This account already exists"); }
  
  // Create a new user
  await User.create({
    firstname,
    lastname,
    email,
    password: await hash(password),
    role: 1
  });

  // Client reponse
  res.status(201).json({ status: 201, message: "User successfully created" });
}

// ============================================================
// ====================== USER SIGNIN =========================
// ============================================================

export async function loginUser(req, res) {
  // Body validation
  const { data, error } = await buildLoginBodySchema().safeParseAsync(req.body);
  if (error) { throw new BadRequestError(error.message); }

  const { email, password } = data;
  
  // Validate user exists and provided password matches
  const user = await User.findOne({ where: { email }});
  if (!user) { throw new BadRequestError("Bad credentials"); }

  const isMatching = await compare(password, user.password);
  if (!isMatching) { throw new BadRequestError("Bad credentials"); }

  // Create authentication tokens
  const { accessToken, refreshToken, csrfToken } = generateAuthenticationTokens(user);

  // Invalidate all user existing Refresh Tokens, then save the new one
  await RefreshToken.destroy({
    where: { userId: user.id }
  });
  await RefreshToken.create({
    userId: user.id,
    token: unsaltedHash(refreshToken.token), // https://security.stackexchange.com/questions/271157/where-to-store-jwt-refresh-tokens
    expiresAt: refreshToken.expiresAt
  });

  // Client reponse
  // Set tokens in client cookies (to prevent XSS)
  res.cookie("x-auth-token", accessToken.token, {
    maxAge: accessToken.expiresInMS,
    ...getCookieSecuritySettings()
  });

  res.cookie("x-auth-refresh-token", refreshToken.token, {
    maxAge: refreshToken.expiresInMS,
    path: "/api/auth/refresh", // Client will only send the "refreshToken" cookie through the /refresh route
    ...getCookieSecuritySettings()
  });

  // Send all tokens (to ease client handling)
  res.json({
    accessToken,
    refreshToken,
    ...(csrfToken && { csrfToken }) // Also send an optional CSRF token (to be stored browser localStorage and sent through headers) to prevent CSRF attacks
  });
}

// ============================================================
// ==================== REFRESH TOKEN =========================
// ============================================================

export async function refreshAccessToken(req, res) {
  // Get refresh token either from cookies (browsers auth) or body (any service)
  const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;

  // Validation
  const { data: token, error } = await buildRefreshTokenSchema().safeParseAsync(rawToken);
  if (error) { return res.status(400).json({ status: 400, message: error.message }); }

  // Find existing token and associated user
  const existingRefreshToken = await RefreshToken.findOne({
    where: { token: unsaltedHash(token) },
    include: { association: "user" }
  });
  if (! existingRefreshToken) { return res.status(401).json({ status: 401, message: "Invalid refresh token provided"}); }

  // Check token validity
  const isProvidedTokenStillValid = new Date().valueOf() < existingRefreshToken.expiresAt.valueOf();
  if (! isProvidedTokenStillValid) {
    await existingRefreshToken.destroy(); // Clean up invalid tokens
    return res.status(401).json({ status: 401, message: "Invalid refresh token provided"});
  }

  // Generate new tokens
  const { accessToken, refreshToken, csrfToken } = generateAuthenticationTokens(existingRefreshToken.user);

  // Delete old token, then save the new   one
  await existingRefreshToken.destroy();
  await RefreshToken.create({
    userId: existingRefreshToken.user.id,
    token: unsaltedHash(refreshToken.token),
    expiresAt: refreshToken.expiresAt
  });

  // Client reponse
  // Set tokens in client cookies (to prevent XSS)
  res.cookie("x-auth-token", accessToken.token, {
    maxAge: accessToken.expiresInMS,
    ...getCookieSecuritySettings()
  });

  res.cookie("x-auth-refresh-token", refreshToken.token, {
    maxAge: refreshToken.expiresInMS,
    path: "/api/auth/refresh", // Client will only send the "refreshToken" cookie through the /refresh route
    ...getCookieSecuritySettings()
  });

  // Send all tokens (to ease client handling)
  res.json({
    accessToken,
    refreshToken,
    ...(csrfToken && { csrfToken }) // Also send an optional CSRF token (to be stored browser localStorage and sent through headers) to prevent CSRF attacks
  });
}

// ============================================================
// ===================== LOGOUT USER ==========================
// ============================================================

export async function logout(_, res) {
  const randomStringToOverrideCookieValueOnClient = Math.random().toString();
  res.cookie("x-auth-token", randomStringToOverrideCookieValueOnClient, getCookieSecuritySettings());
  res.cookie("x-auth-refresh-token", randomStringToOverrideCookieValueOnClient, getCookieSecuritySettings());
  res.status(204).json({ status: 204, message: "Successfully logged out"});
}

// ============================================================
// ================= AUTHENTICATION STATUS ====================
// ============================================================
export async function getCurrentUser(req, res) {
  try {
    const { userId } = authentify(req);
    if (! userId) { throw new NotFoundError("No userId found in token payload"); }

    const user = await User.findByPk(userId, { attributes: { exclude: "password" }});
    if (! user) { throw new NotFoundError(`No user found with userId: ${userId}`); }

    res.json({ isAuthenticated: true, user });

  } catch (error) {
    logger.debug(error);
    res.json({ isAuthenticated: false, user: null });
  }
}


// ============================================================
// ====================== BODY SCHEMA =========================
// ============================================================

function buildSignupBodySchema() {
  return z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().min(1).email(),
    password: z.string().min(8)
  });
}

function buildLoginBodySchema() {
  return z.object({
    email: z.string().email(),
    password: z.string()
  });
}

function buildRefreshTokenSchema() {
  return z.string().min(1);
}


// ============================================================
// =================== RESPONSE HANDLING ======================
// ============================================================


function getCookieSecuritySettings() {
  return {
    httpOnly: true, // Client code cannot access cookie
    secure: auth.cookies.secure, // Only send cookie via HTTPS
    sameSite: auth.sameSiteCookiePolicy // Allow cookie to be sent to cross-origin servers
  };
}