import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { and, eq, desc, sql } from "drizzle-orm";
import * as schema from "@/db/schema";

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient, { schema });

type VocabSeed = {
    word: string;
    translation: string;
    pronunciation?: string | null;
    ipa?: string | null;
    partOfSpeech?: string | null;
    meaning: string;
};

function slugifyForImageFromEnglish(translation: string) {
    return translation
        .toLowerCase()
        .trim()
        .replace(/^to\s+/i, "")          // "to eat" -> "eat"
        .replace(/[()'"]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

function getLevel2ImageUrlFromTranslation(translation: string) {
    const slug = slugifyForImageFromEnglish(translation);
    return `/level2/${slug}.svg`;
}

const VOCAB_LEVEL_2: VocabSeed[] = [
    { word: "once", translation: "eleven", pronunciation: "ohn-seh", ipa: "/'onse/", partOfSpeech: "numeral", meaning: "numeral: eleven, 11" },
    { word: "doce", translation: "twelve", pronunciation: "doh-seh", ipa: "/'dose/", partOfSpeech: "numeral", meaning: "numeral: twelve, 12" },
    { word: "trece", translation: "thirteen", pronunciation: "treh-seh", ipa: "/'trese/", partOfSpeech: "numeral", meaning: "numeral: thirteen, 13" },
    { word: "catorce", translation: "fourteen", pronunciation: "kah-tor-seh", ipa: "/ka'torse/", partOfSpeech: "numeral", meaning: "numeral: fourteen, 14" },
    { word: "quince", translation: "fifteen", pronunciation: "keen-seh", ipa: "/'kinse/", partOfSpeech: "numeral", meaning: "numeral: fifteen, 15" },

    { word: "hoy", translation: "today", pronunciation: "oy", ipa: null, partOfSpeech: "adverb", meaning: "adverb: today" },
    { word: "abril", translation: "april", pronunciation: "ah-breel", ipa: null, partOfSpeech: "noun proper", meaning: "proper noun: April" },
    { word: "rápido", translation: "fast", pronunciation: "rah-pee-doh", ipa: null, partOfSpeech: "adverb, adjective", meaning: "adverb/adjective: fast" },
    { word: "lento", translation: "slow", pronunciation: "len-toh", ipa: null, partOfSpeech: "adverb, adjective", meaning: "adverb/adjective: slow" },
    { word: "fácil", translation: "easy", pronunciation: "fah-seel", ipa: null, partOfSpeech: "adjective", meaning: "adjective: easy" },
    { word: "difícil", translation: "difficult", pronunciation: "dee-fee-seel", ipa: null, partOfSpeech: "adjective", meaning: "adjective: difficult" },
    { word: "ahora", translation: "now", pronunciation: "ah-or-ah", ipa: null, partOfSpeech: "adverb", meaning: "adverb: now" },
    { word: "luego", translation: "later", pronunciation: "lweh-goh", ipa: null, partOfSpeech: "adverb", meaning: "adverb: later" },

    { word: "buenos días", translation: "good morning", pronunciation: "bweh-nos dee-as", ipa: null, partOfSpeech: "phrase", meaning: "phrase: good morning" },
    { word: "buenas tardes", translation: "good afternoon", pronunciation: "bweh-nas tar-des", ipa: null, partOfSpeech: "phrase", meaning: "phrase: good afternoon" },

    { word: "la noche", translation: "night", pronunciation: "no-chay", ipa: null, partOfSpeech: "noun f", meaning: "noun: night" },

    { word: "usar", translation: "to use", pronunciation: "oo-sar", ipa: null, partOfSpeech: "verb", meaning: "verb: to use" },
    { word: "querer", translation: "to want", pronunciation: "keh-rerh", ipa: null, partOfSpeech: "verb", meaning: "verb: to want" },
    { word: "comer", translation: "to eat", pronunciation: "koh-mehr", ipa: null, partOfSpeech: "verb", meaning: "verb: to eat" },
    { word: "beber", translation: "to drink", pronunciation: "beh-behr", ipa: null, partOfSpeech: "verb", meaning: "verb: to drink" },
    { word: "estudiar", translation: "to study", pronunciation: "es-too-dee-ar", ipa: null, partOfSpeech: "verb", meaning: "verb: to study" },
    { word: "saber", translation: "to know", pronunciation: "sah-behr", ipa: null, partOfSpeech: "verb", meaning: "verb: to know" },

    { word: "el dinero", translation: "money", pronunciation: "dee-neh-roh", ipa: null, partOfSpeech: "noun m", meaning: "noun: money" },
    { word: "la ropa", translation: "clothing", pronunciation: "roh-pah", ipa: null, partOfSpeech: "noun f", meaning: "noun: clothing" },
    { word: "la playa", translation: "beach", pronunciation: "plah-yah", ipa: null, partOfSpeech: "noun f", meaning: "noun: beach" },
    { word: "el río", translation: "river", pronunciation: "ree-oh", ipa: null, partOfSpeech: "noun m", meaning: "noun: river" },

    { word: "junio", translation: "june", pronunciation: "hoo-nee-oh", ipa: null, partOfSpeech: "noun proper", meaning: "proper noun: June" },
    { word: "julio", translation: "july", pronunciation: "hoo-lee-oh", ipa: null, partOfSpeech: "noun proper", meaning: "proper noun: July" },

    { word: "lunes", translation: "monday", pronunciation: "loo-ness", ipa: null, partOfSpeech: "noun proper", meaning: "proper noun: Monday" },
    { word: "martes", translation: "tuesday", pronunciation: "mar-tez", ipa: null, partOfSpeech: "noun proper", meaning: "proper noun: Tuesday" },

    { word: "primero", translation: "first", pronunciation: "pree-meh-roh", ipa: null, partOfSpeech: "numeral, adjective", meaning: "numeral/adjective: first" },

    { word: "el cuerpo", translation: "body", pronunciation: "kwer-poh", ipa: null, partOfSpeech: "noun m", meaning: "noun: body" },
    { word: "salud", translation: "bless you", pronunciation: "sah-lood", ipa: null, partOfSpeech: "interjection", meaning: "interjection: bless you" },
    { word: "de nada", translation: "you're welcome", pronunciation: "deh nah-dah", ipa: null, partOfSpeech: "phrase", meaning: "phrase: you're welcome" },
    { word: "la persona", translation: "person", pronunciation: "pehr-soh-nah", ipa: null, partOfSpeech: "noun", meaning: "noun: person" },

    { word: "ayer", translation: "yesterday", pronunciation: "ah-yehr", ipa: null, partOfSpeech: "adverb", meaning: "adverb: yesterday" },
    { word: "la semana", translation: "week", pronunciation: "seh-mah-nah", ipa: null, partOfSpeech: "noun", meaning: "noun: week" },
    { word: "el mes", translation: "month", pronunciation: "mess", ipa: null, partOfSpeech: "noun", meaning: "noun: month" },

    { word: "la vaca", translation: "cow", pronunciation: "bah-cah", ipa: null, partOfSpeech: "noun f", meaning: "noun: cow" },
    { word: "el pollo", translation: "chicken", pronunciation: "poy-yoh", ipa: null, partOfSpeech: "noun m", meaning: "noun: chicken" },

    { word: "aquí", translation: "here", pronunciation: "ah-kee", ipa: null, partOfSpeech: "adverb", meaning: "adverb: here" },
    { word: "perdón", translation: "sorry", pronunciation: "pehr-dohn", ipa: null, partOfSpeech: "interjection", meaning: "interjection: sorry / excuse me" },

    { word: "nunca", translation: "never", pronunciation: "noon-kah", ipa: null, partOfSpeech: "adverb", meaning: "adverb: never" },
    { word: "siempre", translation: "always", pronunciation: "syem-preh", ipa: null, partOfSpeech: "adverb", meaning: "adverb: always" },

    { word: "la mano", translation: "hand", pronunciation: "mah-noh", ipa: null, partOfSpeech: "noun f", meaning: "noun: hand" },
    { word: "el ojo", translation: "eye", pronunciation: "oh-hoh", ipa: null, partOfSpeech: "noun m", meaning: "noun: eye" },

    { word: "blanco", translation: "white", pronunciation: "blahn-koh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: white" },
    { word: "negro", translation: "black", pronunciation: "neg-roh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: black" },
    { word: "sí", translation: "yes", pronunciation: "see", ipa: null, partOfSpeech: "interjection", meaning: "interjection: yes" },

    { word: "el norte", translation: "north", pronunciation: "nor-teh", ipa: null, partOfSpeech: "noun m", meaning: "noun: north" },
    { word: "importante", translation: "important", pronunciation: "eem-por-tahn-teh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: important" },

    { word: "el hermano", translation: "brother", pronunciation: "ehr-mah-noh", ipa: null, partOfSpeech: "noun m", meaning: "noun: brother" },
    { word: "la hermana", translation: "sister", pronunciation: "ehr-mah-nah", ipa: null, partOfSpeech: "noun f", meaning: "noun: sister" },
    { word: "los hermanos", translation: "siblings", pronunciation: "ehr-mah-nos", ipa: null, partOfSpeech: "noun", meaning: "noun: siblings" },

    { word: "nervioso", translation: "nervous", pronunciation: "nehr-byoh-soh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: nervous" },

    { word: "el tiempo", translation: "time", pronunciation: "tyem-poh", ipa: null, partOfSpeech: "noun m", meaning: "noun: time" },
    { word: "el espacio", translation: "space", pronunciation: "es-pah-syoh", ipa: null, partOfSpeech: "noun m", meaning: "noun: space" },

    { word: "la naranja", translation: "orange", pronunciation: "nah-rahn-hah", ipa: null, partOfSpeech: "noun f", meaning: "noun: orange" },
    { word: "claro", translation: "of course", pronunciation: "klah-roh", ipa: null, partOfSpeech: "interjection", meaning: "interjection: of course / sure" },

    { word: "el número", translation: "number", pronunciation: "noo-meh-roh", ipa: null, partOfSpeech: "noun m", meaning: "noun: number" },
];

async function getOrCreateSpanishCourse() {
    const existing = await db.query.courses.findFirst({
        where: eq(schema.courses.title, "Spanish"),
    });
    if (existing) return existing;

    const [created] = await db
        .insert(schema.courses)
        .values({ title: "Spanish", imageSrc: "/mascot.svg" })
        .returning();

    return created;
}

async function getOrCreateLevel(courseId: number, title: string) {
    const existing = await db.query.levels.findFirst({
        where: and(eq(schema.levels.courseId, courseId), eq(schema.levels.title, title)),
    });
    if (existing) return existing;

    const [created] = await db
        .insert(schema.levels)
        .values({ title, courseId })
        .returning();

    return created;
}

async function getNextPosition(levelId: number) {
    const last = await db.query.vocab.findFirst({
        where: eq(schema.vocab.levelId, levelId),
        orderBy: [desc(schema.vocab.position)],
    });
    return (last?.position ?? 0) + 1;
}

async function main() {
    console.log("Seeding Level 2 (additive)…");

    const course = await getOrCreateSpanishCourse();
    const level2 = await getOrCreateLevel(course.id, "Level 2");

    const startPos = await getNextPosition(level2.id);

    // Insert vocab; skip duplicates by (levelId + word) if you have a unique index
    // If you DON'T have a unique index, consider adding one to prevent re-seeding duplicates.
    await db.insert(schema.vocab).values(
        VOCAB_LEVEL_2.map((v, idx) => ({
            word: v.word,
            translation: v.translation,
            pronunciation: v.pronunciation ?? null,
            ipa: v.ipa ?? null,
            partOfSpeech: v.partOfSpeech ?? null,
            meaning: v.meaning,
            example: null,
            exampleTranslation: null,
            mnemonic: null,
            synonyms: null,
            variants: null,
            imageUrl: getLevel2ImageUrlFromTranslation(v.translation),
            audioUrl: null,
            levelId: level2.id,
            position: startPos + idx,
            meta: {},
        }))
    );

    console.log("✅ Level 2 seed complete.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});