CREATE TABLE "user_vocab_srs" (
	"user_id" text NOT NULL,
	"vocab_id" integer NOT NULL,
	"srs_level" integer DEFAULT 0 NOT NULL,
	"first_learned_at" timestamp with time zone,
	"last_reviewed_at" timestamp with time zone,
	"next_review_at" timestamp with time zone,
	CONSTRAINT "user_vocab_srs_pk" PRIMARY KEY("user_id","vocab_id")
);
--> statement-breakpoint
ALTER TABLE "vocab" ADD COLUMN "level_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "vocab" ADD COLUMN "position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user_vocab_srs" ADD CONSTRAINT "user_vocab_srs_vocab_id_vocab_id_fk" FOREIGN KEY ("vocab_id") REFERENCES "public"."vocab"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_vocab_srs_pts_idx" ON "user_vocab_srs" USING btree ("user_id","srs_level");--> statement-breakpoint
CREATE INDEX "user_vocab_srs_due_idx" ON "user_vocab_srs" USING btree ("user_id","next_review_at");--> statement-breakpoint
ALTER TABLE "vocab" ADD CONSTRAINT "vocab_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE cascade ON UPDATE no action;