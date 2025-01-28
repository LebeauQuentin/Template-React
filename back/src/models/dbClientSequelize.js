import "dotenv/config";

// ECMAScript modules (import)
import { Sequelize } from "./index.model.js";
import { logger } from "../lib/logger.js";

// ECMAScript modules (export)

// Instance de connexion à la base de données Postgres
export const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
    // underscored: true
  },
  logging: logger.debug.bind(logger)
});

// Test rapide
// sequelize.authenticate();
