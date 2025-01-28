import { Card } from "./Card.js";
import { RefreshToken , User } from "./User.js";

// User <-> RefreshToken
User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

// Ré-exporter nos modèles
export { Card, RefreshToken, User };
