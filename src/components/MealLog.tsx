"use client";

import { Meal } from "@/lib/db/schema";

interface MealLogProps {
  meals: Meal[];
  onDelete: (id: number) => void;
}

const FLAVOR_KEYS = ["sweet", "sour", "salty", "bitter", "umami", "spice"] as const;

export function MealLog({ meals, onDelete }: MealLogProps) {
  if (meals.length === 0) {
    return (
      <div className="border-2 border-black bg-white">
        <div className="border-b-2 border-black px-4 py-2 bg-black">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
            Meal Log
          </h2>
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            No entries. Log your first meal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-black bg-white">
      <div className="border-b-2 border-black px-4 py-2 bg-black flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
          Meal Log
        </h2>
        <span className="text-xs font-mono text-slate-400">{meals.length} entries</span>
      </div>
      <div className="divide-y divide-black">
        {meals.map((meal) => (
          <div key={meal.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-mono font-bold text-sm uppercase tracking-wide">
                  {meal.dishName}
                </p>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {meal.originCountry || "—"} &middot;{" "}
                  {new Date(meal.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="border-2 border-black px-2 py-1 bg-black text-white">
                  <span className="text-sm font-mono font-bold tabular-nums">
                    {meal.rating}/10
                  </span>
                </div>
                <button
                  onClick={() => onDelete(meal.id)}
                  className="border-2 border-[#FF0000] text-[#FF0000] px-2 py-1 text-xs font-mono uppercase hover:bg-[#FF0000] hover:text-white transition-none"
                >
                  DEL
                </button>
              </div>
            </div>
            {meal.umami !== null && (
              <div className="flex gap-1 flex-wrap">
                {FLAVOR_KEYS.map((f) => {
                  const val = meal[f];
                  if (val === null || val === undefined) return null;
                  return (
                    <span
                      key={f}
                      className="text-xs font-mono border border-black px-1 py-0.5 bg-slate-50"
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}: {val}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
