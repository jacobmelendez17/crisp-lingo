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

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const levels = pgTable("levels", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
});

export const vocab = pgTable("vocab", {
    id: serial("id").primaryKey(),

})