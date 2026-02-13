import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql as dsql } from "drizzle-orm";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

type VocabSeed = {
    word: string;
    translation: string;
    pronunciation?: string | null;
    ipa?: string | null;
    partOfSpeech?: string | null;
    meaning: string;
};

const VOCAB_LEVEL_1: VocabSeed[] = [
    { word: "uno", translation: "one", pronunciation: "oo-noh", ipa: "/'uno/", partOfSpeech: "numeral", meaning: "numeral: one, 1" },
    { word: "dos", translation: "two", pronunciation: "dohs", ipa: "/dos/", partOfSpeech: "numeral", meaning: "numeral: two, 2" },
    { word: "tres", translation: "three", pronunciation: "trehs", ipa: "/tres/", partOfSpeech: "numeral", meaning: "numeral: three, 3" },
    { word: "cuatro", translation: "four", pronunciation: "kwah-troh", ipa: "/'kwatro/", partOfSpeech: "numeral", meaning: "numeral: four, 4" },
    { word: "cinco", translation: "five", pronunciation: "seen-koh", ipa: "/ˈsiŋko/", partOfSpeech: "numeral", meaning: "numeral: five, 5" },
    { word: "seis", translation: "six", pronunciation: "seh-ees", ipa: "/sejs/", partOfSpeech: "numeral", meaning: "numeral: six, 6" },
    { word: "siete", translation: "seven", pronunciation: "syeh-teh", ipa: "/'sjete/", partOfSpeech: "numeral", meaning: "numeral: seven, 7" },
    { word: "ocho", translation: "eight", pronunciation: "oh-choh", ipa: null, partOfSpeech: "numeral", meaning: "numeral: eight, 8" },
    { word: "nueve", translation: "nine", pronunciation: "nweh-veh", ipa: null, partOfSpeech: "numeral", meaning: "numeral: nine, 9" },
    { word: "diez", translation: "ten", pronunciation: "dyehz", ipa: null, partOfSpeech: "numeral", meaning: "numeral: ten, 10" },

    { word: "el gato", translation: "cat", pronunciation: "gah-toh", ipa: null, partOfSpeech: "noun m", meaning: "noun: cat" },
    { word: "el perro", translation: "dog", pronunciation: "peh-rroh", ipa: null, partOfSpeech: "noun m", meaning: "noun: dog" },
    { word: "el hombre", translation: "man", pronunciation: "owm-breh", ipa: null, partOfSpeech: "noun m", meaning: "noun: man" },
    { word: "la mujer", translation: "woman", pronunciation: "moo-hehr", ipa: null, partOfSpeech: "noun f", meaning: "noun: woman" },
    { word: "el niño", translation: "boy", pronunciation: "nee-nyoh", ipa: null, partOfSpeech: "noun m", meaning: "noun: boy" },
    { word: "la niña", translation: "girl", pronunciation: "nee-nyah", ipa: null, partOfSpeech: "noun f", meaning: "noun: girl" },
    { word: "la casa", translation: "house", pronunciation: "kah-sah", ipa: null, partOfSpeech: "noun f", meaning: "noun: house" },
    { word: "el libro", translation: "book", pronunciation: "lee-broh", ipa: null, partOfSpeech: "noun m", meaning: "noun: book" },
    { word: "la mesa", translation: "table", pronunciation: "meh-sah", ipa: null, partOfSpeech: "noun f", meaning: "noun: table" },
    { word: "la silla", translation: "chair", pronunciation: "see-yah", ipa: null, partOfSpeech: "noun f", meaning: "noun: chair" },
    { word: "el día", translation: "day", pronunciation: "dee-ah", ipa: null, partOfSpeech: "noun m", meaning: "noun: day" },
    { word: "el café", translation: "coffee", pronunciation: "kah-feh", ipa: null, partOfSpeech: "noun m", meaning: "noun: coffee" },

    { word: "ser", translation: "to be", pronunciation: "sehr", ipa: null, partOfSpeech: "verb", meaning: "verb: to be" },
    { word: "tener", translation: "to have", pronunciation: "teh-nehr", ipa: null, partOfSpeech: "verb", meaning: "verb: to have" },
    { word: "vivir", translation: "to live", pronunciation: "vee-veer", ipa: null, partOfSpeech: "verb", meaning: "verb: to live" },

    { word: "grande", translation: "big", pronunciation: "grahn-deh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: big" },
    { word: "feliz", translation: "happy", pronunciation: "feh-lees", ipa: null, partOfSpeech: "adjective", meaning: "adjective: happy" },
    { word: "triste", translation: "sad", pronunciation: "tree-steh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: sad" },
    { word: "bueno", translation: "good", pronunciation: "bweh-noh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: good" },
    { word: "malo", translation: "bad", pronunciation: "mah-loh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: bad" },
    { word: "pequeño", translation: "small", pronunciation: "peh-keh-nyoh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: small" },

    { word: "el sol", translation: "sun", pronunciation: "sohl", ipa: null, partOfSpeech: "noun m", meaning: "noun: sun" },
    { word: "la comida", translation: "food", pronunciation: "koh-mee-dah", ipa: null, partOfSpeech: "noun f", meaning: "noun: food" },
    { word: "el agua", translation: "water", pronunciation: "ah-gwah", ipa: null, partOfSpeech: "noun m", meaning: "noun: water" },
    { word: "la leche", translation: "milk", pronunciation: "leh-cheh", ipa: null, partOfSpeech: "noun f", meaning: "noun: milk" },
    { word: "el pan", translation: "bread", pronunciation: "pahn", ipa: null, partOfSpeech: "noun m", meaning: "noun: bread" },
    { word: "la pluma", translation: "pen", pronunciation: "ploo-mah", ipa: null, partOfSpeech: "noun f", meaning: "noun: pen" },

    { word: "yo", translation: "I", pronunciation: "yoh", ipa: null, partOfSpeech: "pronoun", meaning: "pronoun: I" },
    { word: "tú", translation: "you", pronunciation: "too", ipa: null, partOfSpeech: "pronoun", meaning: "pronoun: you (informal)" },
    { word: "la luna", translation: "moon", pronunciation: "loo-nah", ipa: null, partOfSpeech: "noun f", meaning: "noun: moon" },
    { word: "él", translation: "he", pronunciation: "ehl", ipa: null, partOfSpeech: "pronoun", meaning: "pronoun: he" },
    { word: "ella", translation: "she", pronunciation: "eh-yah", ipa: null, partOfSpeech: "pronoun", meaning: "pronoun: she" },
    { word: "nosotros", translation: "we", pronunciation: "noh-soh-trohs", ipa: null, partOfSpeech: "pronoun", meaning: "pronoun: we" },

    { word: "hola", translation: "hello", pronunciation: "oh-lah", ipa: null, partOfSpeech: "interjection", meaning: "interjection: hello" },
    { word: "adiós", translation: "goodbye", pronunciation: "ah-dyohz", ipa: null, partOfSpeech: "interjection", meaning: "interjection: goodbye" },
    { word: "azul", translation: "blue", pronunciation: "ah-sool", ipa: null, partOfSpeech: "adjective, noun", meaning: "adjective/noun: blue" },
    { word: "rojo", translation: "red", pronunciation: "roh-hoh", ipa: null, partOfSpeech: "adjective, noun", meaning: "adjective/noun: red" },
    { word: "verde", translation: "green", pronunciation: "vehr-deh", ipa: null, partOfSpeech: "adjective, noun", meaning: "adjective/noun: green" },
    { word: "gracias", translation: "thank you", pronunciation: "grah-syahs", ipa: null, partOfSpeech: "interjection", meaning: "interjection: thank you" },

    { word: "el nombre", translation: "name", pronunciation: "nohm-breh", ipa: null, partOfSpeech: "noun m", meaning: "noun: name" },
    { word: "la familia", translation: "family", pronunciation: "fah-mee-lee-ah", ipa: null, partOfSpeech: "noun f", meaning: "noun: family" },
    { word: "la escuela", translation: "school", pronunciation: "eh-skweh-lah", ipa: null, partOfSpeech: "noun f", meaning: "noun: school" },
    { word: "la madre", translation: "mother", pronunciation: "mah-dreh", ipa: null, partOfSpeech: "noun f", meaning: "noun: mother" },
    { word: "el padre", translation: "father", pronunciation: "pah-dreh", ipa: null, partOfSpeech: "noun m", meaning: "noun: father" },
    { word: "el trabajo", translation: "work", pronunciation: "trah-bah-hoh", ipa: null, partOfSpeech: "noun m", meaning: "noun: work" },
    { word: "el amigo", translation: "friend", pronunciation: "ah-mee-goh", ipa: null, partOfSpeech: "noun m", meaning: "noun: friend" },

    { word: "ir", translation: "to go", pronunciation: "eer", ipa: null, partOfSpeech: "verb", meaning: "verb: to go" },
    { word: "bonito", translation: "pretty", pronunciation: "boh-nee-toh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: pretty" },
    { word: "hablar", translation: "to speak", pronunciation: "ah-blahr", ipa: null, partOfSpeech: "verb", meaning: "verb: to speak" },
    { word: "feo", translation: "ugly", pronunciation: "feh-oh", ipa: null, partOfSpeech: "adjective", meaning: "adjective: ugly" },
];

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
        .values({ title: "Spanish", imageSrc: "/mascot.svg" })
        .returning({ id: schema.courses.id });

    // Level 1
    const [lvl] = await db
        .insert(schema.levels)
        .values({ title: "Level 1", courseId: course.id })
        .returning({ id: schema.levels.id });

    // Optional default progress row (matches your schema)
    await db.insert(schema.userProgress).values({
        userId: "default",
        userName: "User",
        userImageSrc: "/mascot.svg",
        activeLevel: lvl.id,
        nextLevelUnlocked: false,
        learnedWords: 0,
        learnedGrammar: 0,
    });

    // Vocab with position
    await db.insert(schema.vocab).values(
        VOCAB_LEVEL_1.map((v, idx) => ({
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
            imageUrl: null,
            audioUrl: null,
            levelId: lvl.id,
            position: idx + 1,
            meta: {},
        }))
    );

    console.log("✅ Seed complete.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
