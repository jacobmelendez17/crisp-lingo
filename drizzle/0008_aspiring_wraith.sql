CREATE TYPE "public"."notify_channel" AS ENUM('email', 'sms', 'both');--> statement-breakpoint
CREATE TYPE "public"."review_mode" AS ENUM('standard', 'lightning', 'relaxed');--> statement-breakpoint
CREATE TYPE "public"."review_order" AS ENUM('mixed', 'oldest', 'newest');--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"lesson_cap" integer DEFAULT 20 NOT NULL,
	"lesson_batch_size" integer DEFAULT 5 NOT NULL,
	"review_mode" "review_mode" DEFAULT 'standard' NOT NULL,
	"review_order" "review_order" DEFAULT 'mixed' NOT NULL,
	"notify_channel" "notify_channel" DEFAULT 'email' NOT NULL,
	"notify_news_updates" boolean DEFAULT true NOT NULL,
	"notify_progress" boolean DEFAULT true NOT NULL,
	"notify_inactivity" boolean DEFAULT false NOT NULL,
	"notify_trial_alerts" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_grammar_srs" DROP CONSTRAINT "user_grammar_srs_grammar_id_vocab_id_fk";
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_settings_notify_idx" ON "user_settings" USING btree ("notify_channel");--> statement-breakpoint
ALTER TABLE "user_grammar_srs" ADD CONSTRAINT "user_grammar_srs_grammar_id_grammar_id_fk" FOREIGN KEY ("grammar_id") REFERENCES "public"."grammar"("id") ON DELETE cascade ON UPDATE no action;