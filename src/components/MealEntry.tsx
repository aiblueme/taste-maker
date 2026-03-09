"use client";

import { useState } from "react";
import { Meal } from "@/lib/db/schema";

interface MealEntryProps {
  onMealAdded: (meal: Meal) => void;
}

export function MealEntry({ onMealAdded }: MealEntryProps) {
  const [dishName, setDishName] = useState("");
  const [rating, setRating] = useState<number>(7);
  const [status, setStatus] = useState<"idle" | "analyzing" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dishName.trim()) return;

    setStatus("analyzing");
    setErrorMsg("");

    try {
      // Step 1: Analyze with Gemini
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishName: dishName.trim() }),
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || "Analysis failed");
      }

      const analysis = await analyzeRes.json();

      // Step 2: Save to database
      setStatus("saving");
      const saveRes = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName: dishName.trim(),
          rating,
          ...analysis,
        }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || "Save failed");
      }

      const saved: Meal = await saveRes.json();
      onMealAdded(saved);
      setDishName("");
      setRating(7);
      setStatus("idle");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  const isLoading = status === "analyzing" || status === "saving";

  return (
    <div className="border-2 border-black bg-white">
      <div className="border-b-2 border-black px-4 py-2 bg-black">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
          Log Entry
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label className="block text-xs font-mono uppercase tracking-widest text-black mb-1">
            Dish Name
          </label>
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="e.g. Pad Thai, Ramen, Tagine"
            className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:bg-slate-50 placeholder:text-slate-400"
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-mono uppercase tracking-widest text-black mb-1">
            Rating: <span className="text-black font-bold">{rating}/10</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={10}
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="flex-1 h-1 bg-black accent-black cursor-pointer"
              disabled={isLoading}
            />
            <div className="grid grid-cols-10 gap-[1px] w-40">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  disabled={isLoading}
                  className={`h-6 text-xs font-mono border border-black transition-none ${
                    n <= rating ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {status === "error" && (
          <div className="mb-4 border-2 border-[#FF0000] px-3 py-2 bg-white">
            <p className="text-xs font-mono text-[#FF0000] uppercase">
              Error: {errorMsg}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !dishName.trim()}
          className="w-full border-2 border-black bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-none disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "analyzing"
            ? "QUERYING GEMINI..."
            : status === "saving"
            ? "WRITING TO DB..."
            : "ANALYZE + SAVE"}
        </button>
      </form>
    </div>
  );
}
