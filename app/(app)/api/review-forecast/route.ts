import { NextResponse } from "next/server";
import { getReviewForecast } from "@/db/queries";

export async function GET() {
    try {
        const daily = await getReviewForecast(7);

        return NextResponse.json({ daily })
    } catch (err) {
        console.error("Error fetching review forecast:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}