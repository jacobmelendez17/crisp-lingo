import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql as dsql } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // 1) Clear in FK-safe order (child → parent)
    // If you have userVocabSrs, delete it first
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
    const [course] = await db.insert(schema.courses)
      .values({ title: "Spanish", imageSrc: "/mascot.svg" })
      .returning({ id: schema.courses.id });

    const [level] = await db.insert(schema.levels)
      .values({ title: "Level 1", courseId: course.id })
      .returning({ id: schema.levels.id });

    await db.insert(schema.userProgress).values({
      userId: "default",             // temp user id placeholder
      userName: "User",
      userImageSrc: "/mascot.svg",
      activeLevel: level.id, 
      nextLevelUnlocked: false,
      learnedWords: 0,
      learnedGrammar: 0,
    });

    await db.insert(schema.vocab).values([
      {
        word: "perro",
        translation: "dog",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/dog.svg",
        levelId: level.id,
        position: 1,
      },
      {
        word: "gato",
        translation: "cat",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/cat.svg",
        levelId: level.id,
        position: 2,
      },
      {
        word: "casa",
        translation: "house",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/house.svg",
        levelId: level.id,
        position: 3,
      },
      {
        word: "manzana",
        translation: "apple",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/apple.svg",
        levelId: level.id,
        position: 4,
      },
      {
        word: "silla",
        translation: "chair",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/chair.svg",
        levelId: level.id,
        position: 5,
      },
      {
        word: "test 1",
        translation: "dog",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/dog.svg",
        levelId: level.id,
        position: 6,
      },
      {
        word: "test 2",
        translation: "cat",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/cat.svg",
        levelId: level.id,
        position: 7,
      },
      {
        word: "test 3",
        translation: "house",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/house.svg",
        levelId: level.id,
        position: 8,
      },
      {
        word: "test 4",
        translation: "apple",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/apple.svg",
        levelId: level.id,
        position: 9,
      },
      {
        word: "test 5",
        translation: "chair",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/chair.svg",
        levelId: level.id,
        position: 10,
      },
      {
        word: "test third wave",
        translation: "chair",
        meaning: "Meaning goes here!",
        imageUrl: "/starter-icons/chair.svg",
        levelId: level.id,
        position: 11,
      },
    ]);

    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("Could not seed database");
  }
};

main();
