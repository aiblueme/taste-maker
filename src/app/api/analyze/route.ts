import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { dishName } = await req.json();

    if (!dishName || typeof dishName !== "string") {
      return NextResponse.json({ error: "dishName is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the dish "${dishName}" and return ONLY a valid JSON object with these exact fields:
{
  "origin_country": "<country name>",
  "sweet": <integer 1-10>,
  "sour": <integer 1-10>,
  "salty": <integer 1-10>,
  "bitter": <integer 1-10>,
  "umami": <integer 1-10>,
  "spice": <integer 1-10>
}

Base values on typical preparation of the dish. Return only the JSON, no markdown, no explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const clean = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const data = JSON.parse(clean);

    // Validate and clamp all numeric fields
    const flavors = ["sweet", "sour", "salty", "bitter", "umami", "spice"] as const;
    const validated: Record<string, number | string> = {
      origin_country: String(data.origin_country || "Unknown"),
    };
    for (const f of flavors) {
      const val = parseInt(data[f]);
      validated[f] = isNaN(val) ? 5 : Math.min(10, Math.max(1, val));
    }

    return NextResponse.json(validated);
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
