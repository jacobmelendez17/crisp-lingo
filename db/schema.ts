import { 
    pgTable, 
    text, 
    integer,
    boolean,
    timestamp,
    pgEnum,
    serial,
    primaryKey,
    uniqueIndex,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const trackEnums = pgEnum("track", ["vocab", "grammar", "listen"]);

export const users = pgTable("users", {
    userId: text("user_id").primaryKey(),
    username: text("username"),
    displayName: text("display_name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});