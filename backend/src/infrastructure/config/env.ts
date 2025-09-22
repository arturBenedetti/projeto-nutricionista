import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI!,
  DB_NAME: process.env.DB_NAME || "projeto-nutricionista",
};
