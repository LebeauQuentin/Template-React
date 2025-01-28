export const auth = {
  accessToken: {
    type: process.env.ACCESS_TOKEN_TYPE || "Bearer",
    algorithm: process.env.ACCESS_TOKEN_ALGORITHM || "HS256",
    secret: process.env.ACCESS_TOKEN_SECRET || "Acc3ssTok3nS3c3t!",
    expiresInMS: process.env.ACCESS_TOKEN_EXPIRES_IN_MS || 15 * 60 * 1000, // 15 minutes
    audience: process.env.ACCESS_TOKEN_AUDIENCE || "my_backend_api", // Audience claim of the JWT
    issuer: process.env.ACCESS_TOKEN_ISSUER || "my_authentication_server" // Issuer claim of the JWT
  },
  refreshToken: {
    expiresInMS: process.env.REFRESH_TOKEN_EXPIRES_IN_MS || 30 * 24 * 60 * 60 * 1000 // ~ 1 month
  },
  crypto: {
    scrypt: {
      saltLength: process.env.SCRYPT_SALT_LENGTH || 16, // 16-bytes salt
      hashLength: process.env.SCRYPT_HASH_LENGTH || 64, // 64 characters hash
      cost: process.env.SCRYPT_COST || Math.pow(2, 17), // amount of CPU/memory used
      blockSize: process.env.SCRYPT_BLOCK_SIZE || 8, // 1024 bytes memory blocks
      parallelization: process.env.SCRYPT_PARALLELIZATION || 1, // nb of concurrent threads
      maxmem: process.env.SCRYPT_MAXMEM || 134220800 // maximum memory used by the algorithm. Slightly above 128MB (ie, 128 * blockSize * cost * parallelization = 134,217,728 bytes)
    },
    unsaltedHashAlgorithm: process.env.FAST_HASH_ALGORITHM || "sha256"
  },
  cookies: {
    sameSite: process.env.COOKIES_SAME_SITE || "None",
    secure: process.env.COOKIES_SECURE || true // needed with "Same-Site": "None" cookies
  },
  preventCSRF: process.env.PREVENT_CSRF || false,
};
