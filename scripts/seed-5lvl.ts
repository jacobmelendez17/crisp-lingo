import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql as dsql } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

type VocabSeed = {
  word: string;
  translation: string;
  partOfSpeech?: string;
  ipa?: string;
  mnemonic?: string;
  meaning: string;
  level: number;
};

type GrammarSeed = {
  title: string;
  structure: string;
  summary?: string;
};


const VOCAB: VocabSeed[] = [
  { word: "uno", translation: "one", 
    meaning: `the word uno is a bit more than just representing the number one. Like in english, it is used as an indefinite adjective to describe something.(insert example: "Solo me queda un problema en el examen. Add another question but use question not problem) In the example above, uno is changed to un and for feminine nouns, it would be changed to una as we see in this level's vocabulary lesson. Uno can also be used in the case where a noun is not explicitly mentioned so "uno" acts as a replacement pronoun. "I only have one left". One more meaning to define afer that`, 
    mnemonic: `This is just like the card game "Uno". When you have one card left you scream "UNO!"`,
    partOfSpeech: "oo-noh",
    ipa: "/'uno/",

    level: 1 },
  { word: "dos", translation: "two", meaning: "numeral: two, 2", level: 1 },
  { word: "tres", translation: "three", meaning: "numeral: three, 3", level: 1 },
  { word: "cuatro", translation: "four", meaning: "numeral: four, 4", level: 1 },
  { word: "cinco", translation: "five", meaning: "numeral: five, 5", level: 1 },
  { word: "seis", translation: "six", meaning: "numeral: six, 6", level: 1 },
  { word: "siete", translation: "seven", meaning: "numeral: seven, 7", level: 1 },
  { word: "ocho", translation: "eight", meaning: "numeral: eight, 8", level: 1 },
  { word: "nueve", translation: "nine", meaning: "numeral: nine, 9", level: 1 },
  { word: "diez", translation: "ten", meaning: "numeral: ten, 10", level: 1 },
  { word: "el gato", translation: "cat", meaning: "small, domesticated feline often kept as a pet", level: 1 },
  { word: "el perro", translation: "dog", meaning: "domesticated animal known as a household pet or working companion", level: 1 },

  // 🟦 Level 2
  { word: "el hombre", translation: "man", meaning: "adult male human being", level: 2 },
  { word: "mujer", translation: "woman", meaning: "adult female human being", level: 2 },
  { word: "el niño", translation: "boy", meaning: "young male child; under adolescence", level: 2 },
  { word: "la niña", translation: "girl", meaning: "young female child; under adolescence", level: 2 },
  { word: "la casa", translation: "house", meaning: "a building where people live; home or dwelling", level: 2 },
  { word: "el libro", translation: "book", meaning: "set of written or printed pages bound together for reading or study", level: 2 },
  { word: "la mesa", translation: "table", meaning: "furniture piece with a flat surface for eating, writing, or placing items", level: 2 },
  { word: "la silla", translation: "chair", meaning: "furniture seat for one person to sit on", level: 2 },
  { word: "el día", translation: "day", meaning: "24-hour period or daylight portion", level: 2 },
  { word: "el café", translation: "coffee", meaning: "drink made from roasted coffee beans", level: 2 },
  { word: "ser", translation: "to be", meaning: "used for identity, permanence, professions, origin, and time", level: 2 },
  { word: "tener", translation: "to have", meaning: "expresses possession, relationships, or physical states", level: 2 },

  // 🟨 Level 3
  { word: "vivir", translation: "to live", meaning: "to reside somewhere or to be alive", level: 3 },
  { word: "grande", translation: "big", meaning: "large in size, importance, or degree", level: 3 },
  { word: "feliz", translation: "happy", meaning: "feeling of joy, contentment, or satisfaction", level: 3 },
  { word: "triste", translation: "sad", meaning: "feeling of unhappiness or sorrow", level: 3 },
  { word: "bueno", translation: "good", meaning: "positive, kind, or of high quality", level: 3 },
  { word: "malo", translation: "bad", meaning: "negative, harmful, or unpleasant", level: 3 },
  { word: "pequeño", translation: "small", meaning: "little in size, quantity, or importance", level: 3 },
  { word: "el sol", translation: "sun", meaning: "the star at the center of our solar system providing light and warmth", level: 3 },
  { word: "la comida", translation: "food", meaning: "casual word for food; groceries; prepared dishes; cuisines", level: 3 },
  { word: "el agua", translation: "water", meaning: "clear, life-essential liquid; takes 'el' article for sound", level: 3 },
  { word: "la leche", translation: "milk", meaning: "white liquid produced by mammals used for drinking or cooking", level: 3 },
  { word: "el pan", translation: "bread", meaning: "baked staple food made from flour and water", level: 3 },

  // 🟧 Level 4
  { word: "la pluma", translation: "pen", meaning: "writing instrument using ink; also 'feather' in other contexts", level: 4 },
  { word: "yo", translation: "I", meaning: "first-person singular pronoun", level: 4 },
  { word: "tú", translation: "you", meaning: "informal second-person singular pronoun", level: 4 },
  { word: "la luna", translation: "moon", meaning: "Earth's natural satellite", level: 4 },
  { word: "él", translation: "he", meaning: "third-person singular male pronoun", level: 4 },
  { word: "ella", translation: "she", meaning: "third-person singular female pronoun", level: 4 },
  { word: "nosotros", translation: "we", meaning: "first-person plural pronoun", level: 4 },
  { word: "hola", translation: "hello", meaning: "common greeting used at any time of day", level: 4 },
  { word: "adiós", translation: "goodbye", meaning: "expression for parting ways", level: 4 },
  { word: "azul", translation: "blue", meaning: "color resembling the sky or ocean", level: 4 },
  { word: "rojo", translation: "red", meaning: "warm color resembling blood or fire", level: 4 },
  { word: "verde", translation: "green", meaning: "color resembling grass or leaves", level: 4 },

  // 🟥 Level 5
  { word: "gracias", translation: "thank you", meaning: "expression of gratitude", level: 5 },
  { word: "el nombre", translation: "name", meaning: "word(s) that identify someone or something", level: 5 },
  { word: "la familia", translation: "family", meaning: "group of people related by blood, marriage, or close bonds", level: 5 },
  { word: "la escuela", translation: "school", meaning: "place where students receive education", level: 5 },
  { word: "la madre", translation: "mother", meaning: "a woman who has a child; maternal figure", level: 5 },
  { word: "el padre", translation: "father", meaning: "a man who has a child; paternal figure", level: 5 },
  { word: "el trabajo", translation: "work", meaning: "effort for a purpose; job; workplace", level: 5 },
  { word: "el amigo", translation: "friend", meaning: "someone you know with a bond of trust or liking", level: 5 },
  { word: "ir", translation: "to go", meaning: "movement from one place to another", level: 5 },
  { word: "bonito", translation: "pretty", meaning: "pleasing to the eye (people or things)", level: 5 },
  { word: "hablar", translation: "to speak", meaning: "action of communication through talking", level: 5 },
  { word: "feo", translation: "ugly", meaning: "unpleasant in appearance", level: 5 },
];

const GRAMMAR: GrammarSeed[] = [
  { title: `"el" vs "la"`, structure: `el / la + noun`, summary: `definite article “the” (masc./fem.)` },
  { title: `y`, structure: `X y Y`, summary: `conjunction “and”` },
  { title: `con`, structure: `con + noun/pronoun`, summary: `preposition “with”` },
  { title: `"er" Verbs`, structure: `-er (infinitive)`, summary: `overview of -er verb group (comer, beber, leer…)` },
  { title: `"un" & "una"`, structure: `un / una + noun`, summary: `indefinite article “a/an” (masc./fem.)` },
  { title: `no`, structure: `no + verb`, summary: `sentence negation “no/not”` },
  { title: `en`, structure: `en + place/object`, summary: `preposition “in/on/at”` },
  { title: `"er" verb in "I" form (Present)`, structure: `yo: -o`, summary: `comer → yo como` },
  { title: `"er" verb in "You" form (Present)`, structure: `tú: -es`, summary: `comer → tú comes` },
  { title: `"er" verb in "She/He" form (Present)`, structure: `él/ella: -e`, summary: `comer → él/ella come` },
  { title: `o`, structure: `X o Y`, summary: `conjunction “or”` },
  { title: `-o, -a Adjective Agreement`, structure: `adj -o/-a ↔ noun gender`, summary: `basic gender agreement (niño alto / niña alta)` },
];	

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
};

const main = async () => {
  try {
    console.log("Seeding database…");

    // 1) Clear in FK-safe order
    try { await db.execute(dsql`TRUNCATE TABLE "user_vocab_srs" RESTART IDENTITY CASCADE`); } catch {}
    await db.execute(dsql`
      TRUNCATE TABLE
        "user_vocab_srs",
        "user_progress",
        "vocab",
        "levels",
        "courses"
      RESTART IDENTITY CASCADE
    `);

    // 2) Course
    const [course] = await db.insert(schema.courses)
      .values({ title: "Spanish", imageSrc: "/mascot.svg" })
      .returning({ id: schema.courses.id });

    // 3) Levels (5 levels, 12 words each)
    const groups = chunk(VOCAB, 12);
    const levelIds: number[] = [];
    for (let i = 0; i < groups.length; i++) {
      const [lvl] = await db.insert(schema.levels)
        .values({ title: `Level ${i + 1}`, courseId: course.id })
        .returning({ id: schema.levels.id });
      levelIds.push(lvl.id);
    }

    // 4) Optional: create a default user progress row
    await db.insert(schema.userProgress).values({
      userId: "default",
      userName: "User",
      userImageSrc: "/mascot.svg",
      activeLevel: levelIds[0],
      nextLevelUnlocked: false,
      learnedWords: 0,
      learnedGrammar: 0,
    });

    // 5) Insert vocab (12 per level, position 1..12)
    for (let gi = 0; gi < groups.length; gi++) {
      const levelId = levelIds[gi];
      const items = groups[gi];
      for (let i = 0; i < items.length; i++) {
        const v = items[i];
        await db.insert(schema.vocab).values({
          word: v.word,
          translation: v.translation,
          meaning: v.meaning,
          imageUrl: null,
          levelId,
          position: i + 1,
        });
      }
    }

    await db.insert(schema.grammar).values(
      GRAMMAR.map((g, i) => ({
        title: g.title,
        structure: g.structure,
        summary: g.summary ?? null,
        levelId: levelIds[0], // all level 1
        position: i + 1,      // 1..12
        imageUrl: null,
        audioUrl: null,
      }))
    );

    console.log("Seeding finished.");
  } catch (error) {
    console.error(error);
    throw new Error("Could not seed database");
  }
};

main();