"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ConjugationRow } from "@/db/queries";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Props = {
  unlocked: ConjugationRow[];
};

type VerbGroup = "ar" | "er" | "ir" | "irregular";
type Tense = string;  // keep flexible for now
type Person = string;

function getMetaStr(meta: any, key: string) {
  const v = meta?.[key];
  return typeof v === "string" ? v : "";
}

export function ConjugationSetup({ unlocked }: Props) {
  const router = useRouter();

  const [groups, setGroups] = useState<Record<VerbGroup, boolean>>({
    ar: true,
    er: true,
    ir: true,
    irregular: true,
  });

  const [tense, setTense] = useState<string>("all");
  const [person, setPerson] = useState<string>("all");
  const [level, setLevel] = useState<number | "all">("all");

  const availableTenses = useMemo(() => {
    const set = new Set<string>();
    for (const row of unlocked) set.add(getMetaStr(row.meta, "tense"));
    return ["all", ...Array.from(set).filter(Boolean).sort()];
  }, [unlocked]);

  const availablePeople = useMemo(() => {
    const set = new Set<string>();
    for (const row of unlocked) set.add(getMetaStr(row.meta, "person"));
    return ["all", ...Array.from(set).filter(Boolean).sort()];
  }, [unlocked]);

  const availableLevels = useMemo(() => {
    const set = new Set<number>();
    for (const row of unlocked) set.add(row.levelId);
    return ["all" as const, ...Array.from(set).sort((a, b) => a - b)];
  }, [unlocked]);

  const filtered = useMemo(() => {
    return unlocked.filter((row) => {
      const vg = getMetaStr(row.meta, "verbGroup") as VerbGroup;
      if (vg && groups[vg] === false) return false;

      const t = getMetaStr(row.meta, "tense");
      if (tense !== "all" && t !== tense) return false;

      const p = getMetaStr(row.meta, "person");
      if (person !== "all" && p !== person) return false;

      if (level !== "all" && row.levelId !== level) return false;

      return true;
    });
  }, [unlocked, groups, tense, person, level]);

  function start() {
    const params = new URLSearchParams();
    params.set("ar", String(groups.ar));
    params.set("er", String(groups.er));
    params.set("ir", String(groups.ir));
    params.set("irregular", String(groups.irregular));
    params.set("tense", tense);
    params.set("person", person);
    params.set("level", String(level));
    router.push(`/practice/conjugations/session?${params.toString()}`);
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="grid gap-3 rounded-2xl border border-black/5 bg-neutral-50 p-4 md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-neutral-800">Verb groups</p>
          {(["ar", "er", "ir", "irregular"] as const).map((k) => (
            <div key={k} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2">
              <Label className="text-sm text-neutral-800">{k.toUpperCase()}</Label>
              <Switch checked={groups[k]} onCheckedChange={(v) => setGroups((p) => ({ ...p, [k]: v }))} />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-neutral-800">Tense</p>
          <select
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            value={tense}
            onChange={(e) => setTense(e.target.value)}
          >
            {availableTenses.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All tenses" : t}
              </option>
            ))}
          </select>

          <p className="mt-3 text-sm font-semibold text-neutral-800">Person</p>
          <select
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
          >
            {availablePeople.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All persons" : p}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-neutral-800">Level</p>
          <select
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
            value={String(level)}
            onChange={(e) => {
              const v = e.target.value;
              setLevel(v === "all" ? "all" : Number(v));
            }}
          >
            {availableLevels.map((l) => (
              <option key={String(l)} value={String(l)}>
                {l === "all" ? "All levels" : `Level ${l}`}
              </option>
            ))}
          </select>

          <div className="mt-4 rounded-xl bg-white/70 p-3">
            <p className="text-sm text-neutral-800">
              Unlocked exercises: <span className="font-semibold">{filtered.length}</span>
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              Start will pull from this filtered pool.
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.slice(0, 12).map((row) => (
          <div key={row.id} className="rounded-2xl border border-black/5 bg-white p-4">
            <p className="text-sm font-semibold text-neutral-900">{row.title}</p>
            <p className="mt-1 text-xs text-neutral-600">
              L{row.levelId} • {getMetaStr(row.meta, "tense")} • {getMetaStr(row.meta, "person")} •{" "}
              {getMetaStr(row.meta, "verbGroup")}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end">
        <Button onClick={start} disabled={filtered.length === 0}>
          Start session
        </Button>
      </div>
    </div>
  );
}
