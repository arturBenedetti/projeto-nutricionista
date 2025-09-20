export const config = {
  mongoUri:
    process.env.MONGO_URI ||
    "mongodb+srv://frmodena_db_user:ovqfm7Oo6M2T2K1M@users.tqzzb9r.mongodb.net/?retryWrites=true&w=majority&appName=Users",
  dbName: process.env.DB_NAME || "myapp",
};
