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
export const reviewModeEnum = pgEnum('review_mode', ['standard', 'lightning', 'relaxed'] as const);
export const reviewOrderEnum = pgEnum('review_order', ['mixed', 'oldest', 'newest'] as const);
export const notifyChannelEnum = pgEnum('notify_channel', ['email', 'sms', 'both'] as const);


export const users = pgTable("users", {
    userId: text("user_id").primaryKey(),
    username: text("username"),
    displayName: text("display_name"),
    email: text("email"),
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
    ipa: varchar("ipa", {length: 256 }),
    meaning: text("meaning").notNull(),
    example: text("example"),
    exampleTranslation: text("example_translation"),
    mnemonic: text("mnemonic"),
    partOfSpeech: varchar("part_of_speech", { length: 64 }),
    synonyms: text("synonyms"),
    variants: text("variants"),
    imageUrl: text("image_src"),
    audioUrl: text("audio_src"),
    levelId: integer("level_id").references(() => levels.id, { onDelete: "cascade" }).notNull(),
    position: integer("position").notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userVocabSrs = pgTable("user_vocab_srs", {
    userId: text("user_id").notNull(),
    vocabId: integer("vocab_id").references(() => vocab.id, { onDelete: "cascade" }).notNull(),
    srsLevel: integer("srs_level").notNull().default(0),
    firstLearnedAt: timestamp("first_learned_at", { withTimezone: true }),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    nextReviewAt: timestamp("next_review_at", { withTimezone: true }),
    correctCount: integer("correct_count").notNull().default(0),
    incorrectCount: integer("incorrect_count").notNull().default(0),
},
(t) => [
    primaryKey({ columns: [t.userId, t.vocabId], name: "user_vocab_srs_pk" }),
    index("user_vocab_srs_pts_idx").on(t.userId, t.srsLevel),
    index("user_vocab_srs_due_idx").on(t.userId, t.nextReviewAt),
  ]
);

export const vocabExamples = pgTable("vocab_examples", {
    id: serial("id").primaryKey(),
    vocabId: integer("vocab_id")
        .references(() => vocab.id, { onDelete: "cascade"})
        .notNull(),
    sentence: text("sentence").notNull(),
    translation: text("translation"),
    audioUrl: text("audio_src"),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
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
    levelId: integer("level_id").references(() => levels.id, { onDelete: "cascade" }).notNull(),
    position: integer("position").notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userGrammarSrs = pgTable("user_grammar_srs", {
    userId: text("user_id").notNull(),
    grammarId: integer("grammar_id").references(() => grammar.id, { onDelete: "cascade" }).notNull(),
    srsLevel: integer("srs_level").notNull().default(0),
    firstLearnedAt: timestamp("first_learned_at", { withTimezone: true }),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    nextReviewAt: timestamp("next_review_at", { withTimezone: true }),
},
(t) => [
    primaryKey({ columns: [t.userId, t.grammarId], name: "user_grammar_srs_pk" }),
    index("user_grammar_srs_pts_idx").on(t.userId, t.srsLevel),
    index("user_grammar_srs_due_idx").on(t.userId, t.nextReviewAt),
    ]
);

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

export const userSettings = pgTable(
  'user_settings',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => users.userId, { onDelete: 'cascade' }),

    lessonCap: integer('lesson_cap').notNull().default(20),
    lessonBatchSize: integer('lesson_batch_size').notNull().default(5),

    reviewMode: reviewModeEnum('review_mode').notNull().default('standard'),
    reviewOrder: reviewOrderEnum('review_order').notNull().default('mixed'),

    notifyChannel: notifyChannelEnum('notify_channel').notNull().default('email'),
    notifyNewsUpdates: boolean('notify_news_updates').notNull().default(true),
    notifyProgress: boolean('notify_progress').notNull().default(true),
    notifyInactivity: boolean('notify_inactivity').notNull().default(false),
    notifyTrialAlerts: boolean('notify_trial_alerts').notNull().default(true),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('user_settings_notify_idx').on(t.notifyChannel),
  ]
);
