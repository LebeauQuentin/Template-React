import "dotenv/config";

// ECMAScript modules (import)
import { Sequelize } from "sequelize";

// ECMAScript modules (export)

// Instance de connexion à la base de données Postgres
export const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
    // underscored: true
  },
  logging: false // Pour désactiver l'affichage en console des requêtes SQL que Sequelize passe vers la BDD
});

// Test rapide
// sequelize.authenticate();
