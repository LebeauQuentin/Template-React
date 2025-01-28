import pino from "pino";
import { server } from '../config/config-server.js';

export const logger = pino({
  level: server.logLevel
});
