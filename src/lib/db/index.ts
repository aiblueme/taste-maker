import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "sqlite.db");

// Ensure the data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Run inline migration on startup (no separate migration files needed)
export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dish_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      origin_country TEXT,
      sweet INTEGER,
      sour INTEGER,
      salty INTEGER,
      bitter INTEGER,
      umami INTEGER,
      spice INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
}

initDb();
