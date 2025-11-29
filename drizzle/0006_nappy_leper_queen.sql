ALTER TABLE "user_vocab_srs" ADD COLUMN "correct_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_vocab_srs" ADD COLUMN "incorrect_count" integer DEFAULT 0 NOT NULL;