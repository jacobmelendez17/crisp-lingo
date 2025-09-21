import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    userId: text("user_id").primaryKey(),
    username: text("username"),
    displayName: text("display_name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
})