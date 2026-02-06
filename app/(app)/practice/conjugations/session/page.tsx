"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CardShell } from "@/components/card-shell";
import { Button } from "@/components/ui/button";

type Item = {
    id: number;
    title: string;
    levelId: number;
    meta: {
        prompt?: string;
        hintEn?: string;
        answer?: string;
        [k: string]: any;
    };
};

function normalize(s: string) {
    return s.trim().toLowerCase();
}

export default function ConjugationsSessionPage() {
    const sp = useSearchParams();
    const router = useRouter();

    const [items, setItems] = useState<Item[]>([]);
    const [idx, setIdx] = useState(0);
    const [value, setValue] = useState("");
    const [result, setResult] = useState<"idle" | "correct" | "wrong">("idle");

    const query = useMemo(() => sp.toString(), [sp]);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/practice/conjugations?${query}&limit=25`, { cache:'no-store' });
            const data = await res.json();
            setItems(data.items ?? []);
            setIdx(0);
            setValue("");
            setResult("idle");
        })();
    }, [query]);

    const current = items[idx];
    const prompt = current?.meta?.prompt ?? "____";
    const hint = current?.meta?.hintEn ?? "";
    const answer = current?.meta?.answer ?? "";

    function submit() {
        if (!current) return;
        const ok = normalize(value) === normalize(answer);
        setResult(ok ? "correct" : "wrong");
    }

    function next() {
        setResult("idle");
        setValue("");
        setIdx((i) => Math.min(i + 1, items.length - 1));
    }

    if (!items.length) {
        return (
            <main className="mx-auto w-ful max-w-[900px] px-4 py-10">
                <CardShell title="Verb Conjugation">
                    <p className="text-sm text-neutral-700">
                        No exercises found for these filters (or none unlocked yet).
                    </p>
                    <div className="mt-4">
                        <Button variant="secondary" onClick={() => router.push("/practice/conjugations")}>
                            Back to setup
                        </Button>
                    </div>
                </CardShell>
            </main>
        )
    }

    return (
        <main className="mx-auto w-full max-w-[900px] px-4 py-10">
            <CardShell title="Verb Conjugations" className="bg-white">
                <div className="space-y-5">
                <div className="text-xs text-neutral-500">
                    Item {idx + 1} / {items.length} • Level {current.levelId}
                </div>

                <div className="rounded-2xl border border-black/5 bg-neutral-50 p-5">
                    <p className="text-xl font-semibold text-neutral-900">
                    {prompt}
                    </p>
                    {hint && <p className="mt-2 text-sm text-neutral-600">{hint}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-800">Your answer</label>
                    <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") submit();
                    }}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:ring-4 focus:ring-[var(--leaf)]/30"
                    placeholder="Type the conjugated verb…"
                    />

                    {result === "wrong" && (
                    <p className="text-sm text-red-600">
                        Not quite. Correct answer: <span className="font-semibold">{answer}</span>
                    </p>
                    )}
                    {result === "correct" && (
                    <p className="text-sm text-emerald-700">Correct ✅</p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary" onClick={() => router.push("/practice/conjugations")}>
                    Exit
                    </Button>

                    {result === "idle" ? (
                    <Button onClick={submit} disabled={!value.trim()}>
                        Check
                    </Button>
                    ) : (
                    <Button onClick={next} disabled={idx >= items.length - 1}>
                        Next
                    </Button>
                    )}
                </div>
                </div>
            </CardShell>
        </main>
    );
}