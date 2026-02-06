import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { and, eq, sql as dsql } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

type ConjSeed = {
    title: string;
    levelNumber: number; // which level to attach this grammar row to
    position: number; // ordering within that level
    meta: {
        kind: "conjugation";
        verbGroup: "ar" | "er" | "ir" | "irregular";
        infinitive: string;
        tense: "present" | "preterite";
        person: "yo" | "tú" | "él/ella/usted" | "nosotros" | "ustedes";
        answer: string;
        prompt: string;  // Spanish sentence with ____
        hintEn: string;  // English hint
    };
};

const CONJ: ConjSeed[] = [
    // -------- Level 5: -AR present (starter set)
    {
        title: "hablar — present — yo",
        levelNumber: 5,
        position: 1,
        meta: {
            kind: "conjugation",
            verbGroup: "ar",
            infinitive: "hablar",
            tense: "present",
            person: "yo",
            answer: "hablo",
            prompt: "Yo ____ con mi amigo.",
            hintEn: "Present tense — 1st person singular (yo)",
        },
    },
    {
        title: "hablar — present — tú",
        levelNumber: 5,
        position: 2,
        meta: {
            kind: "conjugation",
            verbGroup: "ar",
            infinitive: "hablar",
            tense: "present",
            person: "tú",
            answer: "hablas",
            prompt: "Tú ____ mucho en clase.",
            hintEn: "Present tense — 2nd person singular (tú)",
        },
    },
    {
        title: "hablar — present — él/ella/usted",
        levelNumber: 5,
        position: 3,
        meta: {
            kind: "conjugation",
            verbGroup: "ar",
            infinitive: "hablar",
            tense: "present",
            person: "él/ella/usted",
            answer: "habla",
            prompt: "Ella ____ con su profesora.",
            hintEn: "Present tense — 3rd person singular (él/ella/usted)",
        },
    },

    // -------- -ER present
    {
        title: "comer — present — yo",
        levelNumber: 5,
        position: 4,
        meta: {
            kind: "conjugation",
            verbGroup: "er",
            infinitive: "comer",
            tense: "present",
            person: "yo",
            answer: "como",
            prompt: "Yo ____ pan por la mañana.",
            hintEn: "Present tense — 1st person singular (yo)",
        },
    },
    {
        title: "comer — present — tú",
        levelNumber: 5,
        position: 5,
        meta: {
            kind: "conjugation",
            verbGroup: "er",
            infinitive: "comer",
            tense: "present",
            person: "tú",
            answer: "comes",
            prompt: "¿Tú ____ carne?",
            hintEn: "Present tense — 2nd person singular (tú)",
        },
    },
    {
        title: "comer — present — él/ella/usted",
        levelNumber: 5,
        position: 6,
        meta: {
            kind: "conjugation",
            verbGroup: "er",
            infinitive: "comer",
            tense: "present",
            person: "él/ella/usted",
            answer: "come",
            prompt: "Él ____ en la cafetería.",
            hintEn: "Present tense — 3rd person singular (él/ella/usted)",
        },
    },

    // -------- -IR present
    {
        title: "vivir — present — yo",
        levelNumber: 5,
        position: 7,
        meta: {
            kind: "conjugation",
            verbGroup: "ir",
            infinitive: "vivir",
            tense: "present",
            person: "yo",
            answer: "vivo",
            prompt: "Yo ____ en Arizona.",
            hintEn: "Present tense — 1st person singular (yo)",
        },
    },
    {
        title: "vivir — present — tú",
        levelNumber: 5,
        position: 8,
        meta: {
            kind: "conjugation",
            verbGroup: "ir",
            infinitive: "vivir",
            tense: "present",
            person: "tú",
            answer: "vives",
            prompt: "Tú ____ cerca de la escuela.",
            hintEn: "Present tense — 2nd person singular (tú)",
        },
    },
    {
        title: "vivir — present — él/ella/usted",
        levelNumber: 5,
        position: 9,
        meta: {
            kind: "conjugation",
            verbGroup: "ir",
            infinitive: "vivir",
            tense: "present",
            person: "él/ella/usted",
            answer: "vive",
            prompt: "Mi madre ____ en esa casa.",
            hintEn: "Present tense — 3rd person singular (él/ella/usted)",
        },
    },

    // -------- Irregulars present (super common)
    {
        title: "ser — present — yo",
        levelNumber: 5,
        position: 10,
        meta: {
            kind: "conjugation",
            verbGroup: "irregular",
            infinitive: "ser",
            tense: "present",
            person: "yo",
            answer: "soy",
            prompt: "Yo ____ estudiante.",
            hintEn: "Present tense — irregular verb SER — 1st person singular (yo)",
        },
    },
    {
        title: "tener — present — yo",
        levelNumber: 5,
        position: 11,
        meta: {
            kind: "conjugation",
            verbGroup: "irregular",
            infinitive: "tener",
            tense: "present",
            person: "yo",
            answer: "tengo",
            prompt: "Yo ____ un libro.",
            hintEn: "Present tense — irregular verb TENER — 1st person singular (yo)",
        },
    },
    {
        title: "ir — present — nosotros",
        levelNumber: 5,
        position: 12,
        meta: {
            kind: "conjugation",
            verbGroup: "irregular",
            infinitive: "ir",
            tense: "present",
            person: "nosotros",
            answer: "vamos",
            prompt: "Nosotros ____ a la escuela.",
            hintEn: "Present tense — irregular verb IR — nosotros",
        },
    },

    // -------- Preterite starters (a few)
    {
        title: "hablar — preterite — yo",
        levelNumber: 5,
        position: 13,
        meta: {
            kind: "conjugation",
            verbGroup: "ar",
            infinitive: "hablar",
            tense: "preterite",
            person: "yo",
            answer: "hablé",
            prompt: "Ayer yo ____ con mi profesor.",
            hintEn: "Past (preterite) — 1st person singular (yo)",
        },
    },
    {
        title: "comer — preterite — yo",
        levelNumber: 5,
        position: 14,
        meta: {
            kind: "conjugation",
            verbGroup: "er",
            infinitive: "comer",
            tense: "preterite",
            person: "yo",
            answer: "comí",
            prompt: "Ayer yo ____ en casa.",
            hintEn: "Past (preterite) — 1st person singular (yo)",
        },
    },
    {
        title: "vivir — preterite — yo",
        levelNumber: 5,
        position: 15,
        meta: {
            kind: "conjugation",
            verbGroup: "ir",
            infinitive: "vivir",
            tense: "preterite",
            person: "yo",
            answer: "viví",
            prompt: "En 2020 yo ____ en otra ciudad.",
            hintEn: "Past (preterite) — 1st person singular (yo)",
        },
    },
];

async function getLevelId(levelNumber: number) {
    // matches your seed-5lvl convention: title = "Level X"
    const row = await db.query.levels.findFirst({
        where: eq(schema.levels.title, `Level ${levelNumber}`),
        columns: { id: true },
    });

    if (!row) {
        throw new Error(`Could not find Level ${levelNumber}. Did you seed levels yet?`);
    }
    return row.id;
}

const main = async () => {
    console.log("Seeding conjugation grammar…");

    // Insert grammar rows
    for (const item of CONJ) {
        const levelId = await getLevelId(item.levelNumber);

        const [g] = await db
            .insert(schema.grammar)
            .values({
                title: item.title,
                structure: "conjugation",
                summary: "Conjugate the verb to fit the sentence.",
                explanation: null,
                example: null,
                exampleTranslation: null,
                partOfSpeech: "verb",
                imageUrl: null,
                audioUrl: null,
                levelId,
                position: item.position,
                meta: item.meta,
            })
            .returning({ id: schema.grammar.id });

        // OPTIONAL: unlock instantly for your default dev user by setting srsLevel=5
        // Comment this out if you want to unlock naturally through study.
        await db
            .insert(schema.userGrammarSrs)
            .values({
                userId: "default",
                grammarId: g.id,
                srsLevel: 5,
            })
            .onConflictDoUpdate({
                target: [schema.userGrammarSrs.userId, schema.userGrammarSrs.grammarId],
                set: { srsLevel: 5 },
            });
    }

    console.log("Conjugation grammar seed finished ✅");
};

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
