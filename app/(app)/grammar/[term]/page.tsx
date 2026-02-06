import { notFound } from "next/navigation";
import db from "@/db/drizzle";
import { grammar } from "@/db/schema";
import { eq } from "drizzle-orm";

type PageProps = {
  params: { term: string };
};

export default async function GrammarTermPage({ params }: PageProps) {
  const term = decodeURIComponent(params.term);

  const row = await db.query.grammar.findFirst({
    where: eq(grammar.title, term),
  });

  if (!row) return notFound();

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">{row.title}</h1>
      {row.summary && <p className="mt-2 text-sm text-neutral-700">{row.summary}</p>}
      {row.structure && (
        <pre className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm">
          {row.structure}
        </pre>
      )}
    </main>
  );
}
