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
    varchar,
    jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const itemTypeEnum = pgEnum("item_type", ["vocab", "grammar"] as const);
export const srsStatusEnum = pgEnum("srs_status", [
    "new",
    "learning",
    "reviewing",
    "completed",
    "suspended"
] as const);

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
    word: varchar("word", { length: 128 }).notNull(),
    translation: varchar("translation", { length: 128 }).notNull(),
    pronunciation: varchar("pronunciation", { length: 256 }),
    meaning: text("meaning").notNull(),
    example: text("example"),
    exampleTranslation: text("example_translation"),
    mnemonic: text("mnemonic"),
    partOfSpeech: varchar("part_of_speech", { length: 64 }),
    synonyms: text("synonyms"),
    imageUrl: text("image_src"),
    audioUrl: text("audio_src"),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const grammar = pgTable("grammar", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 160 }).notNull(),
    structure: varchar("structure", { length: 64 }).notNull(),
    summary: text("summary"),
    explanation: text("explanation"),
    example: text("example"),
    exampleTranslation: text("example_translation"),
    partOfSpeech: varchar("part_of_speech", { length: 64 }),
    imageUrl: text("image_src"),
    audioUrl: text("audio_src"),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/mascot.svg"), //CHANGE THE IMAGE DEFAULT
    activeLevel: integer("active_level").notNull().references(() => levels.id, { onDelete: "cascade"}),
    nextLevelUnlocked: boolean("next_level_unlocked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    learnedWords: integer("learned_words").notNull().default(0),
    learnedGrammar: integer("learned_grammar").notNull().default(0),
});