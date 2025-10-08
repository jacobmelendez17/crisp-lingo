import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");

        await db.delete(schema.userProgress);

        await db.insert(schema.vocab).values([
            {
                id: 1,
                word: "Word!",
                translation: "Word in english!",
                meaning: "Meaning goes here!",
            },
        ])

        console.log("Seeding finished");
    } catch (error) {
        console.error(error);
        throw new Error("Could not seed database");
    }
}

main();