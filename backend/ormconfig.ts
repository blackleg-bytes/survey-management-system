import { DataSource } from "typeorm";
import { config } from "dotenv";
import { join } from "path";

config(); // Load .env file

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, "src", "**", "*.entity.{ts,js}")],
  migrations: [join(__dirname, "src", "migrations", "*.{ts,js}")],
  synchronize: false, // Always false for migrations
  logging: true,
});
