CREATE TABLE "user_grammar_srs" (
	"user_id" text NOT NULL,
	"grammar_id" integer NOT NULL,
	"srs_level" integer DEFAULT 0 NOT NULL,
	"first_learned_at" timestamp with time zone,
	"last_reviewed_at" timestamp with time zone,
	"next_review_at" timestamp with time zone,
	CONSTRAINT "user_grammar_srs_pk" PRIMARY KEY("user_id","grammar_id")
);
--> statement-breakpoint
ALTER TABLE "grammar" ADD COLUMN "level_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "grammar" ADD COLUMN "position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "vocab" ADD COLUMN "ipa" varchar(256);--> statement-breakpoint
ALTER TABLE "user_grammar_srs" ADD CONSTRAINT "user_grammar_srs_grammar_id_vocab_id_fk" FOREIGN KEY ("grammar_id") REFERENCES "public"."vocab"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_grammar_srs_pts_idx" ON "user_grammar_srs" USING btree ("user_id","srs_level");--> statement-breakpoint
CREATE INDEX "user_grammar_srs_due_idx" ON "user_grammar_srs" USING btree ("user_id","next_review_at");--> statement-breakpoint
ALTER TABLE "grammar" ADD CONSTRAINT "grammar_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;