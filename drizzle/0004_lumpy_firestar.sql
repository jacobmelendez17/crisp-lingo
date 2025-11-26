CREATE TABLE "vocab_examples" (
	"id" serial PRIMARY KEY NOT NULL,
	"vocab_id" integer NOT NULL,
	"sentence" text NOT NULL,
	"translation" text,
	"audio_src" text,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vocab_examples" ADD CONSTRAINT "vocab_examples_vocab_id_vocab_id_fk" FOREIGN KEY ("vocab_id") REFERENCES "public"."vocab"("id") ON DELETE cascade ON UPDATE no action;