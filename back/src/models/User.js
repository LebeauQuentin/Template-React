import { DataTypes,  Model } from "sequelize";
import { sequelize } from './dbClientSequelize.js';

export class User extends Model {}
export class RefreshToken extends Model {}

// TODO Securiser rôle

User.init({
  firstname: { type: DataTypes.STRING },
  lastname: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING },
  role: {type: DataTypes.INTEGER, defaultValue: 1}
}, { sequelize, tableName: "user" });
  
RefreshToken.init({
  token: { type: DataTypes.STRING },
  expiresAt: { type: DataTypes.DATE },
  userId: { type: DataTypes.INTEGER }
}, { sequelize,   tableName: "refreshToken" });
  