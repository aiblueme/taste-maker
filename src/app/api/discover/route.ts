import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { meals } from "@/lib/db/schema";
import { gte } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { country } = await req.json();

    if (!country || typeof country !== "string") {
      return NextResponse.json({ error: "country is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    // Build taste profile from highly-rated meals
    const highRated = await db.select().from(meals).where(gte(meals.rating, 7));
    const allMeals = await db.select().from(meals);
    const triedDishes = allMeals.map((m) => m.dishName).join(", ");

    const flavors = ["sweet", "sour", "salty", "bitter", "umami", "spice"] as const;
    let profileSummary = "No taste preference data available.";

    if (highRated.length > 0) {
      const profile: Record<string, number> = {};
      for (const flavor of flavors) {
        const values = highRated
          .map((m) => m[flavor])
          .filter((v): v is number => v !== null && v !== undefined);
        profile[flavor] =
          values.length > 0
            ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
            : 5;
      }
      profileSummary = Object.entries(profile)
        .map(([k, v]) => `${k}: ${v}/10`)
        .join(", ");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a culinary database. Based on a user's taste profile and the dishes they have already tried, recommend 3 dishes from ${country} they haven't tried that match their preferences.

User taste profile (from highly-rated meals): ${profileSummary}
Dishes already tried: ${triedDishes || "none"}

Return ONLY a valid JSON array with exactly 3 objects, no markdown:
[
  {
    "name": "<dish name>",
    "description": "<one sentence, factual description>",
    "why": "<one sentence explaining match to taste profile>",
    "sweet": <1-10>,
    "sour": <1-10>,
    "salty": <1-10>,
    "bitter": <1-10>,
    "umami": <1-10>,
    "spice": <1-10>
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const suggestions = JSON.parse(clean);

    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error("Invalid response format from Gemini");
    }

    return NextResponse.json({ country, suggestions: suggestions.slice(0, 3) });
  } catch (err) {
    console.error("[POST /api/discover]", err);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
