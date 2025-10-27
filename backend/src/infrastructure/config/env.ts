import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI não definida no .env");
}

const defaultJwtSecret = "secret-key-for-jwt-token-generation-change-in-production";
const jwtSecret: string = process.env.JWT_SECRET || defaultJwtSecret;
const jwtExpiration: string = process.env.JWT_EXPIRATION || "24h";

export const config = {
  MONGO_URI: process.env.MONGO_URI || "",
  DB_NAME: process.env.DB_NAME || "projeto-nutricionista",
  JWT_SECRET: jwtSecret,
  JWT_EXPIRATION: jwtExpiration,
} as const;
