import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_RL!);
const db = drizzle(sql, { schema });

const main = async() => {
    try {
        console.log("Resetting the database");

        await db.delete(schema.userProgress);

        console.log("Reset finished!");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to reset database");
    }
}

main();