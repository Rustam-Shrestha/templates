import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env["DATABASE_WRITE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_WRITE_URL environment variable is required for drizzle-kit.");
}

export default defineConfig({
  schema: "./src/core/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl
  }
});

