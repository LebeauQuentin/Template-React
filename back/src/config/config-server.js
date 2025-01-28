//TODO Modification EN PROD
export const server = {
  protocol: "http",
  host: "0.0.0.0",
  port: 3000,
  cors: ("*"),
  logLevel: "DEBUG",
  isProd: process.env.NODE_ENV === "production" || false
};
