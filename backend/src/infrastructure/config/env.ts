import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI não definida no .env");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME || "projeto-nutricionista",
};
