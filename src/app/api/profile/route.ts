import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meals } from "@/lib/db/schema";
import { gte } from "drizzle-orm";

export async function GET() {
  try {
    // Use meals rated 7 or higher for the taste profile
    const highRated = await db
      .select()
      .from(meals)
      .where(gte(meals.rating, 7));

    if (highRated.length === 0) {
      return NextResponse.json({
        count: 0,
        profile: null,
        message: "No meals rated 7+ yet. Add more meals to build your profile.",
      });
    }

    const flavors = ["sweet", "sour", "salty", "bitter", "umami", "spice"] as const;
    const profile: Record<string, number> = {};

    for (const flavor of flavors) {
      const values = highRated
        .map((m) => m[flavor])
        .filter((v): v is number => v !== null && v !== undefined);
      profile[flavor] =
        values.length > 0
          ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
          : 0;
    }

    // Top flavor = dominant taste signature
    const dominantFlavor = (Object.entries(profile) as [string, number][])
      .sort(([, a], [, b]) => b - a)[0][0];

    return NextResponse.json({
      count: highRated.length,
      profile,
      dominantFlavor,
    });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return NextResponse.json({ error: "Profile fetch failed" }, { status: 500 });
  }
}
