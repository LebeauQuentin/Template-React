import { Card, sequelize } from "../models/index.model.js";

console.log("🚧 Ajout de cartes de test...");
await Card.create({ content: "Café", color: "#5c3715" });
await Card.create({ content: "Thé", color: "#0d3d0f" });
await Card.create({ content: "Reblochon savoyard" });
await Card.create({ content: "Maman le 01/01/1970", position: 1 });
await Card.create({ content: "Mamie le 01/01/1940", position: 2 });
await Card.create({ content: "John Doe", position: 1 });


console.log("✅ Migration OK ! Fermeture de la base..."); // On ferme le tunnel de connexion pour que le script s'arrête bien
await sequelize.close();
