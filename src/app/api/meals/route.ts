import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meals, NewMeal } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(meals).orderBy(desc(meals.createdAt));
    return NextResponse.json(all);
  } catch (err) {
    console.error("[GET /api/meals]", err);
    return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dishName, rating, originCountry, sweet, sour, salty, bitter, umami, spice } = body;

    if (!dishName || typeof dishName !== "string") {
      return NextResponse.json({ error: "dishName is required" }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 10) {
      return NextResponse.json({ error: "rating must be 1-10" }, { status: 400 });
    }

    const newMeal: NewMeal = {
      dishName: dishName.trim(),
      rating: parseInt(rating),
      originCountry: originCountry || null,
      sweet: sweet || null,
      sour: sour || null,
      salty: salty || null,
      bitter: bitter || null,
      umami: umami || null,
      spice: spice || null,
      createdAt: new Date(),
    };

    const inserted = await db.insert(meals).values(newMeal).returning();
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (err) {
    console.error("[POST /api/meals]", err);
    return NextResponse.json({ error: "Failed to save meal" }, { status: 500 });
  }
}
