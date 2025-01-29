import { hash } from "../lib/crypto.js";
import { Card, sequelize, User } from "../models/index.model.js";

const passwordAnnie =await hash("ilovereact");

console.log("🚧 Ajout de cartes de test...");
await Card.create({ content: "Café", color: "#5c3715" });
await Card.create({ content: "Thé", color: "#0d3d0f" });
await Card.create({ content: "Reblochon savoyard" });
await Card.create({ content: "Maman le 01/01/1970", position: 1 });
await Card.create({ content: "Mamie le 01/01/1940", position: 2 });
await Card.create({ content: "John Doe", position: 1 });

await User.create({ id: 1, firstname: "Annie", lastname: "Zildur", email: "annie.zildur@oclock.io", password: passwordAnnie, role: 2});

console.log("✅ Migration OK ! Fermeture de la base..."); // On ferme le tunnel de connexion pour que le script s'arrête bien
await sequelize.close();
