import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const meals = sqliteTable("meals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dishName: text("dish_name").notNull(),
  rating: integer("rating").notNull(), // 1-10, user-provided
  originCountry: text("origin_country"),
  sweet: integer("sweet"),   // 1-10, Gemini-analyzed
  sour: integer("sour"),
  salty: integer("salty"),
  bitter: integer("bitter"),
  umami: integer("umami"),
  spice: integer("spice"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;
