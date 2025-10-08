CREATE TYPE "public"."item_type" AS ENUM('vocab', 'grammar');--> statement-breakpoint
CREATE TYPE "public"."srs_status" AS ENUM('new', 'learning', 'reviewing', 'completed', 'suspended');--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_src" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"structure" varchar(64) NOT NULL,
	"summary" text,
	"explanation" text,
	"example" text,
	"example_translation" text,
	"part_of_speech" varchar(64),
	"image_src" text,
	"audio_src" text,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"course_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"user_id" text PRIMARY KEY NOT NULL,
	"user_name" text DEFAULT 'User' NOT NULL,
	"user_image_src" text DEFAULT '/mascot.svg' NOT NULL,
	"active_level" integer NOT NULL,
	"next_level_unlocked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"learned_words" integer DEFAULT 0 NOT NULL,
	"learned_grammar" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" text,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab" (
	"id" serial PRIMARY KEY NOT NULL,
	"word" varchar(128) NOT NULL,
	"translation" varchar(128) NOT NULL,
	"pronunciation" varchar(256),
	"meaning" text NOT NULL,
	"example" text,
	"example_translation" text,
	"mnemonic" text,
	"part_of_speech" varchar(64),
	"image_src" text,
	"audio_src" text,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "levels" ADD CONSTRAINT "levels_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_active_level_levels_id_fk" FOREIGN KEY ("active_level") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;