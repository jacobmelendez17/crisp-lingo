import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql as dsql, eq } from "drizzle-orm";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

type ExampleSeed = {
    sentence: string;
    translation?: string | null;
    audioUrl?: string | null;
};

type VocabSeed = {
    word: string;
    translation: string;
    pronunciation?: string | null;
    ipa?: string | null;
    partOfSpeech?: string | null;
    meaning: string;

    // Optional “card” fields
    mnemonic?: string | null;
    synonyms?: string | null;
    variants?: string | null;

    // Extra metadata
    castilian?: string | null;
    tags?: string[] | null;

    // Optional seeded examples
    examples?: ExampleSeed[];
};

function slugifyForImageFromEnglish(translation: string) {
    return translation
        .toLowerCase()
        .trim()
        .replace(/^to\s+/i, "") // "to be" -> "be"
        .replace(/[()'"]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

function getLevel1ImageUrlFromTranslation(translation: string) {
    const slug = slugifyForImageFromEnglish(translation);
    return `/level1/${slug}.svg`;
}

function joinExampleSentences(examples?: ExampleSeed[]) {
    if (!examples?.length) return null;
    return examples.map((ex) => ex.sentence).join("\n");
}

function joinExampleTranslations(examples?: ExampleSeed[]) {
    if (!examples?.length) return null;
    return examples
        .map((ex) => ex.translation ?? "")
        .filter(Boolean)
        .join("\n");
}

const UNO_EXAMPLES: ExampleSeed[] = [
    {
        sentence: "Tengo uno.",
        translation: "I have one.",
        audioUrl: null,
    },
    {
        sentence: "Uno está aquí.",
        translation: "One is here.",
        audioUrl: null,
    },
    {
        sentence: "Solo necesito uno más.",
        translation: "I only need one more.",
        audioUrl: null,
    },
    {
        sentence: "Me queda uno todavía.",
        translation: "I still have one left.",
        audioUrl: null,
    },
    {
        sentence: "Uno debe pensar bien antes de tomar una decisión importante.",
        translation:
            "One must think carefully before making an important decision.",
        audioUrl: null,
    },
];

const VOCAB_LEVEL_1: VocabSeed[] = [
    {
        word: "uno",
        translation: "one",
        pronunciation: "oo-noh",
        ipa: "/ˈu.no/",
        partOfSpeech: "numeral",
        meaning:
            `The word "uno" means "one." It can be used as a number, but it also changes form depending on how it is used. Before a masculine singular noun, "uno" usually becomes "un." Before a feminine singular noun, it becomes "una." It can also stand alone as a pronoun when the noun is understood, such as in "Tengo uno" ("I have one"). In more general statements, it can mean "one" in the sense of "a person" or "people in general."`,
        mnemonic:
            `This is just like the card game "Uno." When you have one card left, you shout "UNO!"`,
        synonyms: "alguno",
        variants: "un, una, unos, unas",
        castilian: "N/A",
        tags: ["number"],
        examples: UNO_EXAMPLES,
    },
    {
        word: "dos",
        translation: "two",
        pronunciation: "dohs",
        ipa: "/dos/",
        partOfSpeech: "numeral",
        meaning: "numeral: two, 2",
        tags: ["number"],
    },
    {
        word: "tres",
        translation: "three",
        pronunciation: "trehs",
        ipa: "/tɾes/",
        partOfSpeech: "numeral",
        meaning: "numeral: three, 3",
        tags: ["number"],
    },
    {
        word: "cuatro",
        translation: "four",
        pronunciation: "kwah-troh",
        ipa: "/ˈkwa.tɾo/",
        partOfSpeech: "numeral",
        meaning: "numeral: four, 4",
        tags: ["number"],
    },
    {
        word: "cinco",
        translation: "five",
        pronunciation: "seen-koh",
        ipa: "/ˈsiŋ.ko/",
        partOfSpeech: "numeral",
        meaning: "numeral: five, 5",
        tags: ["number"],
    },
    {
        word: "seis",
        translation: "six",
        pronunciation: "seh-ees",
        ipa: "/sejs/",
        partOfSpeech: "numeral",
        meaning: "numeral: six, 6",
        tags: ["number"],
    },
    {
        word: "siete",
        translation: "seven",
        pronunciation: "syeh-teh",
        ipa: "/ˈsje.te/",
        partOfSpeech: "numeral",
        meaning: "numeral: seven, 7",
        tags: ["number"],
    },
    {
        word: "ocho",
        translation: "eight",
        pronunciation: "oh-choh",
        ipa: null,
        partOfSpeech: "numeral",
        meaning: "numeral: eight, 8",
        tags: ["number"],
    },
    {
        word: "nueve",
        translation: "nine",
        pronunciation: "nweh-veh",
        ipa: null,
        partOfSpeech: "numeral",
        meaning: "numeral: nine, 9",
        tags: ["number"],
    },
    {
        word: "diez",
        translation: "ten",
        pronunciation: "dyehz",
        ipa: null,
        partOfSpeech: "numeral",
        meaning: "numeral: ten, 10",
        tags: ["number"],
    },

    {
        word: "el gato",
        translation: "cat",
        pronunciation: "gah-toh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: cat",
        tags: ["animal"],
    },
    {
        word: "el perro",
        translation: "dog",
        pronunciation: "peh-rroh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: dog",
        tags: ["animal"],
    },
    {
        word: "el hombre",
        translation: "man",
        pronunciation: "owm-breh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: man",
        tags: ["person"],
    },
    {
        word: "la mujer",
        translation: "woman",
        pronunciation: "moo-hehr",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: woman",
        tags: ["person"],
    },
    {
        word: "el niño",
        translation: "boy",
        pronunciation: "nee-nyoh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: boy",
        tags: ["person"],
    },
    {
        word: "la niña",
        translation: "girl",
        pronunciation: "nee-nyah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: girl",
        tags: ["person"],
    },
    {
        word: "la casa",
        translation: "house",
        pronunciation: "kah-sah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: house",
        tags: ["home"],
    },
    {
        word: "el libro",
        translation: "book",
        pronunciation: "lee-broh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: book",
        tags: ["object"],
    },
    {
        word: "la mesa",
        translation: "table",
        pronunciation: "meh-sah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: table",
        tags: ["object"],
    },
    {
        word: "la silla",
        translation: "chair",
        pronunciation: "see-yah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: chair",
        tags: ["object"],
    },
    {
        word: "el día",
        translation: "day",
        pronunciation: "dee-ah",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: day",
        tags: ["time"],
    },
    {
        word: "el café",
        translation: "coffee",
        pronunciation: "kah-feh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: coffee",
        tags: ["food"],
    },

    {
        word: "ser",
        translation: "to be",
        pronunciation: "sehr",
        ipa: null,
        partOfSpeech: "verb",
        meaning: "verb: to be",
        tags: ["verb"],
    },
    {
        word: "tener",
        translation: "to have",
        pronunciation: "teh-nehr",
        ipa: null,
        partOfSpeech: "verb",
        meaning: "verb: to have",
        tags: ["verb"],
    },
    {
        word: "vivir",
        translation: "to live",
        pronunciation: "vee-veer",
        ipa: null,
        partOfSpeech: "verb",
        meaning: "verb: to live",
        tags: ["verb"],
    },

    {
        word: "grande",
        translation: "big",
        pronunciation: "grahn-deh",
        ipa: null,
        partOfSpeech: "adjective",
        meaning: "adjective: big",
        tags: ["adjective"],
    },
    {
        word: "feliz",
        translation: "happy",
        pronunciation: "feh-lees",
        ipa: null,
        partOfSpeech: "adjective",
        meaning: "adjective: happy",
        tags: ["adjective"],
    },
    {
        word: "triste",
        translation: "sad",
        pronunciation: "tree-steh",
        ipa: null,
        partOfSpeech: "adjective",
        meaning: "adjective: sad",
        tags: ["adjective"],
    },
    {
        word: "bueno",
        translation: "good",
        pronunciation: "bweh-noh",
        ipa: null,
        partOfSpeech: "adjective",
        meaning: "adjective: good",
        tags: ["adjective"],
    },
    {
        word: "malo",
        translation: "bad",
        pronunciation: "mah-loh",
        ipa: null,
        partOfSpeech: "adjective",
        meaning: "adjective: bad",
        tags: ["adjective"],
    },
    {
        word: "pequeño",
        translation: "small",
        pronunciation: "peh-keh-nyoh",
        ipa: null,
        partOfSpeech: "adjective",
        meaning: "adjective: small",
        tags: ["adjective"],
    },

    {
        word: "el sol",
        translation: "sun",
        pronunciation: "sohl",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: sun",
        tags: ["nature"],
    },
    {
        word: "la comida",
        translation: "food",
        pronunciation: "koh-mee-dah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: food",
        tags: ["food"],
    },
    {
        word: "el agua",
        translation: "water",
        pronunciation: "ah-gwah",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: water",
        tags: ["food"],
    },
    {
        word: "la leche",
        translation: "milk",
        pronunciation: "leh-cheh",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: milk",
        tags: ["food"],
    },
    {
        word: "el pan",
        translation: "bread",
        pronunciation: "pahn",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: bread",
        tags: ["food"],
    },
    {
        word: "la pluma",
        translation: "pen",
        pronunciation: "ploo-mah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: pen",
        tags: ["object"],
    },

    {
        word: "yo",
        translation: "I",
        pronunciation: "yoh",
        ipa: null,
        partOfSpeech: "pronoun",
        meaning: "pronoun: I",
        tags: ["pronoun"],
    },
    {
        word: "tú",
        translation: "you",
        pronunciation: "too",
        ipa: null,
        partOfSpeech: "pronoun",
        meaning: "pronoun: you (informal)",
        tags: ["pronoun"],
    },
    {
        word: "la luna",
        translation: "moon",
        pronunciation: "loo-nah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: moon",
        tags: ["nature"],
    },
    {
        word: "él",
        translation: "he",
        pronunciation: "ehl",
        ipa: null,
        partOfSpeech: "pronoun",
        meaning: "pronoun: he",
        tags: ["pronoun"],
    },
    {
        word: "ella",
        translation: "she",
        pronunciation: "eh-yah",
        ipa: null,
        partOfSpeech: "pronoun",
        meaning: "pronoun: she",
        tags: ["pronoun"],
    },
    {
        word: "nosotros",
        translation: "we",
        pronunciation: "noh-soh-trohs",
        ipa: null,
        partOfSpeech: "pronoun",
        meaning: "pronoun: we",
        tags: ["pronoun"],
    },

    {
        word: "hola",
        translation: "hello",
        pronunciation: "oh-lah",
        ipa: null,
        partOfSpeech: "interjection",
        meaning: "interjection: hello",
        tags: ["greeting"],
    },
    {
        word: "adiós",
        translation: "goodbye",
        pronunciation: "ah-dyohz",
        ipa: null,
        partOfSpeech: "interjection",
        meaning: "interjection: goodbye",
        tags: ["greeting"],
    },
    {
        word: "azul",
        translation: "blue",
        pronunciation: "ah-sool",
        ipa: null,
        partOfSpeech: "adjective, noun",
        meaning: "adjective/noun: blue",
        tags: ["color"],
    },
    {
        word: "rojo",
        translation: "red",
        pronunciation: "roh-hoh",
        ipa: null,
        partOfSpeech: "adjective, noun",
        meaning: "adjective/noun: red",
        tags: ["color"],
    },
    {
        word: "verde",
        translation: "green",
        pronunciation: "vehr-deh",
        ipa: null,
        partOfSpeech: "adjective, noun",
        meaning: "adjective/noun: green",
        tags: ["color"],
    },
    {
        word: "gracias",
        translation: "thank you",
        pronunciation: "grah-syahs",
        ipa: null,
        partOfSpeech: "interjection",
        meaning: "interjection: thank you",
        tags: ["greeting"],
    },

    {
        word: "el nombre",
        translation: "name",
        pronunciation: "nohm-breh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: name",
        tags: ["people"],
    },
    {
        word: "la familia",
        translation: "family",
        pronunciation: "fah-mee-lee-ah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: family",
        tags: ["people"],
    },
    {
        word: "la escuela",
        translation: "school",
        pronunciation: "eh-skweh-lah",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: school",
        tags: ["place"],
    },
    {
        word: "la madre",
        translation: "mother",
        pronunciation: "mah-dreh",
        ipa: null,
        partOfSpeech: "noun f",
        meaning: "noun: mother",
        tags: ["people"],
    },
    {
        word: "el padre",
        translation: "father",
        pronunciation: "pah-dreh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: father",
        tags: ["people"],
    },
    {
        word: "el trabajo",
        translation: "work",
        pronunciation: "trah-bah-hoh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: work",
        tags: ["life"],
    },
    {
        word: "el amigo",
        translation: "friend",
        pronunciation: "ah-mee-goh",
        ipa: null,
        partOfSpeech: "noun m",
        meaning: "noun: friend",
        tags: ["people"],
    },

    {
        word: "ir",
        translation: "to go",
        pronunciation: "eer",
        ipa: null,
        partOfSpeech: "verb",
        meaning: "verb: to go",
        tags: ["verb"],
    },
    {
        word: "bonito",
        translation: "pretty",
        pronunciation: "boh-nee-toh",
        ipa: null,
        partOfSpeech: "adjective",
        meaning: "adjective: pretty",
        tags: ["adjective"],
    },
    {
        word: "hablar",
        translation: "to speak",
        pronunciation: "ah-blahr",
        ipa: null,
        partOfSpeech: "verb",
        meaning: "verb: to speak",
        tags: ["verb"],
    },
    {
        word: "feo",
        translation: "ugly",
        pronunciation: "feh-oh",
        ipa: null,
        partOfSpeech: "adjective",
        meaning: "adjective: ugly",
        tags: ["adjective"],
    },
];

async function seedExamplesForWord(word: string, examples: ExampleSeed[]) {
    const vocabRow = await db.query.vocab.findFirst({
        where: eq(schema.vocab.word, word),
    });

    if (!vocabRow || examples.length === 0) return;

    await db.insert(schema.vocabExamples).values(
        examples.map((ex, idx) => ({
            vocabId: vocabRow.id,
            sentence: ex.sentence,
            translation: ex.translation ?? null,
            audioUrl: ex.audioUrl ?? null,
            position: idx + 1,
        }))
    );
}

async function main() {
    console.log("Seeding Level 1…");

    // Clear in FK-safe order
    await db.execute(dsql`
    TRUNCATE TABLE
      "user_vocab_srs",
      "user_grammar_srs",
      "user_progress",
      "vocab_examples",
      "grammar",
      "vocab",
      "levels",
      "courses"
    RESTART IDENTITY CASCADE
  `);

    // Course
    const [course] = await db
        .insert(schema.courses)
        .values({
            title: "Spanish",
            imageSrc: "/mascot.svg",
        })
        .returning({ id: schema.courses.id });

    // Level 1
    const [lvl] = await db
        .insert(schema.levels)
        .values({
            title: "Level 1",
            courseId: course.id,
        })
        .returning({ id: schema.levels.id });

    // Optional default progress row
    await db.insert(schema.userProgress).values({
        userId: "default",
        userName: "User",
        userImageSrc: "/mascot.svg",
        activeLevel: lvl.id,
        nextLevelUnlocked: false,
        learnedWords: 0,
        learnedGrammar: 0,
    });

    // Insert vocab
    await db.insert(schema.vocab).values(
        VOCAB_LEVEL_1.map((v, idx) => ({
            word: v.word,
            translation: v.translation,
            pronunciation: v.pronunciation ?? null,
            ipa: v.ipa ?? null,
            partOfSpeech: v.partOfSpeech ?? null,
            meaning: v.meaning,
            example: joinExampleSentences(v.examples),
            exampleTranslation: joinExampleTranslations(v.examples),
            mnemonic: v.mnemonic ?? null,
            synonyms: v.synonyms ?? null,
            variants: v.variants ?? null,
            imageUrl: getLevel1ImageUrlFromTranslation(v.translation),
            audioUrl: null,
            levelId: lvl.id,
            position: idx + 1,
            meta: {
                castilian: v.castilian ?? null,
                tags: v.tags ?? [],
            },
        }))
    );

    // Insert per-word vocab examples
    for (const vocabItem of VOCAB_LEVEL_1) {
        if (vocabItem.examples?.length) {
            await seedExamplesForWord(vocabItem.word, vocabItem.examples);
        }
    }

    console.log("✅ Seed complete.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});