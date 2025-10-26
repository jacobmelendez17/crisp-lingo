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
  meaning: string;
};

// NOTE: We normalized a couple of typos from the provided list:
// - "ten  diez" -> Spanish word is "diez", translation "ten"
// - "la woman  mujer" -> Spanish word is "mujer", translation "woman"
// We keep articles (el/la) where the user provided them.

const VOCAB: VocabSeed[] = [
  { word: "uno", translation: "one", meaning: "numeral: one, 1" },
  { word: "dos", translation: "two", meaning: "numeral: two, 2" },
  { word: "tres", translation: "three", meaning: "numeral: three, 3" },
  { word: "cuatro", translation: "four", meaning: "numeral: four, 4" },
  { word: "cinco", translation: "five", meaning: "numeral: five, 5" },
  { word: "seis", translation: "six", meaning: "numeral: six, 6" },
  { word: "siete", translation: "seven", meaning: "numeral: seven, 7" },
  { word: "ocho", translation: "eight", meaning: "numeral: eight, 8" },
  { word: "nueve", translation: "nine", meaning: "numeral: nine, 9" },
  { word: "diez", translation: "ten", meaning: "numeral: ten, 10" },
  { word: "el gato", translation: "cat", meaning: "small, domesticated feline often kept as a pet" },
  { word: "el perro", translation: "dog", meaning: "domesticated animal known as a household pet or working companion" },

  { word: "el hombre", translation: "man", meaning: "adult male human being" },
  { word: "mujer", translation: "woman", meaning: "adult female human being" },
  { word: "el niño", translation: "boy", meaning: "young male child; under adolescence" },
  { word: "la niña", translation: "girl", meaning: "young female child; under adolescence" },
  { word: "la casa", translation: "house", meaning: "a building where people live; home or dwelling" },
  { word: "el libro", translation: "book", meaning: "set of written or printed pages bound together for reading or study" },
  { word: "la mesa", translation: "table", meaning: "furniture piece with a flat surface for eating, writing, or placing items" },
  { word: "la silla", translation: "chair", meaning: "furniture seat for one person to sit on" },
  { word: "el día", translation: "day", meaning: "24-hour period or daylight portion" },
  { word: "el café", translation: "coffee", meaning: "drink made from roasted coffee beans" },
  { word: "ser", translation: "to be", meaning: "used for identity, permanence, professions, origin, and time" },
  { word: "tener", translation: "to have", meaning: "expresses possession, relationships, or physical states" },

  { word: "vivir", translation: "to live", meaning: "to reside somewhere or to be alive" },
  { word: "grande", translation: "big", meaning: "large in size, importance, or degree" },
  { word: "feliz", translation: "happy", meaning: "feeling of joy, contentment, or satisfaction" },
  { word: "triste", translation: "sad", meaning: "feeling of unhappiness or sorrow" },
  { word: "bueno", translation: "good", meaning: "positive, kind, or of high quality" },
  { word: "malo", translation: "bad", meaning: "negative, harmful, or unpleasant" },
  { word: "pequeño", translation: "small", meaning: "little in size, quantity, or importance" },
  { word: "el sol", translation: "sun", meaning: "the star at the center of our solar system providing light and warmth" },
  { word: "la comida", translation: "food", meaning: "casual word for food; groceries; prepared dishes; cuisines" },
  { word: "el agua", translation: "water", meaning: "clear, life-essential liquid; takes 'el' article for sound" },
  { word: "la leche", translation: "milk", meaning: "white liquid produced by mammals used for drinking or cooking" },
  { word: "el pan", translation: "bread", meaning: "baked staple food made from flour and water" },

  { word: "la pluma", translation: "pen", meaning: "writing instrument using ink; also 'feather' in other contexts" },
  { word: "yo", translation: "I", meaning: "first-person singular pronoun" },
  { word: "tú", translation: "you", meaning: "informal second-person singular pronoun" },
  { word: "la luna", translation: "moon", meaning: "Earth's natural satellite" },
  { word: "él", translation: "he", meaning: "third-person singular male pronoun" },
  { word: "ella", translation: "she", meaning: "third-person singular female pronoun" },
  { word: "nosotros", translation: "we", meaning: "first-person plural pronoun" },
  { word: "hola", translation: "hello", meaning: "common greeting used at any time of day" },
  { word: "adiós", translation: "goodbye", meaning: "expression for parting ways" },
  { word: "azul", translation: "blue", meaning: "color resembling the sky or ocean" },
  { word: "rojo", translation: "red", meaning: "warm color resembling blood or fire" },
  { word: "verde", translation: "green", meaning: "color resembling grass or leaves" },

  { word: "gracias", translation: "thank you", meaning: "expression of gratitude" },
  { word: "el nombre", translation: "name", meaning: "word(s) that identify someone or something" },
  { word: "la familia", translation: "family", meaning: "group of people related by blood, marriage, or close bonds" },
  { word: "la escuela", translation: "school", meaning: "place where students receive education" },
  { word: "la madre", translation: "mother", meaning: "a woman who has a child; maternal figure" },
  { word: "el padre", translation: "father", meaning: "a man who has a child; paternal figure" },
  { word: "el trabajo", translation: "work", meaning: "effort for a purpose; job; workplace" },
  { word: "el amigo", translation: "friend", meaning: "someone you know with a bond of trust or liking" },
  { word: "ir", translation: "to go", meaning: "movement from one place to another" },
  { word: "bonito", translation: "pretty", meaning: "pleasing to the eye (people or things)" },
  { word: "hablar", translation: "to speak", meaning: "action of communication through talking" },
  { word: "feo", translation: "ugly", meaning: "unpleasant in appearance" },
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

    console.log("Seeding finished.");
  } catch (error) {
    console.error(error);
    throw new Error("Could not seed database");
  }
};

main();
