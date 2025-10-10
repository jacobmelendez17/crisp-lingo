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

        try {
            await db.execute(dsql`delete from "user_progress"`);
        } catch {

        }

        await db.insert(schema.vocab).values([
            {
                word: "perro",
                translation: "dog",
                meaning: "Meaning goes here!",
                imageUrl: "/starter-icons/dog.svg"
            },
            {
                word: "gato",
                translation: "cat",
                meaning: "Meaning goes here!",
                imageUrl: "/starter-icons/cat.svg"
            },
            {
                word: "casa",
                translation: "house",
                meaning: "Meaning goes here!",
                imageUrl: "/starter-icons/house.svg"
            },
            {
                word: "manzana",
                translation: "apple",
                meaning: "Meaning goes here!",
                imageUrl: "/starter-icons/apple.svg"
            },
            {
                word: "silla",
                translation: "chair",
                meaning: "Meaning goes here!",
                imageUrl: "/starter-icons/chair.svg"
            },
        ]);

        console.log("Seeding finished");
    } catch (error) {
        console.error(error);
        throw new Error("Could not seed database");
    }
}

main();