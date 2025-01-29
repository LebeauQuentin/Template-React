export const server = {
  protocol: process.env.PROTOCOL,
  host: process.env.HOST,
  port: process.env.PORT,
  cors: process.env.ALLOWED_DOMAINS,
  logLevel: "DEBUG",
  isProd: process.env.NODE_ENV === "production" || false
};
