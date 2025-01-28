import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { logger } from "./logger.js";
import { auth } from '../config/config-auth.js';

const { algorithm, audience, expiresInMS, issuer, secret, type } = auth.accessToken;
const { expiresInMS: refreshTokenExpiresInMS } = auth.refreshToken;
const { preventCSRF } = auth; // for browser-based clients

export function generateAuthenticationTokens(user) {
  const csrfToken = preventCSRF ? generateRandomString() : null;
  const payload = {
    userId: user.id, // Only store minimal information, and no PII (Personnaly Identifiable Information) as email, names, address, etc...
    ...(csrfToken && { csrfToken })
  };

  return {
    accessToken: {
      token: generateJwtToken(payload),
      type,
      expiresInMS,
      expiresAt: computeDate(expiresInMS),
    },
    refreshToken: {
      token: generateRandomString(),
      expiresAt: computeDate(refreshTokenExpiresInMS),
      expiresInMS: refreshTokenExpiresInMS
    },
    ...(csrfToken && { csrfToken })
  };
}

export function generateJwtToken(payload) {
  const expiresIn = `${expiresInMS}ms`;
  return jwt.sign(payload, secret, { algorithm, audience, expiresIn, issuer });
}

export function verifyJwtToken(token) {
  try {
    return jwt.verify(token, secret, { algorithms: algorithm });
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export function generateRandomString() {
  return crypto.randomBytes(128).toString("base64");
}

function computeDate(durationInMS) {
  new Date(new Date().valueOf() + durationInMS);
}