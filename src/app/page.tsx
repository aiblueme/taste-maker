"use client";

import { useEffect, useState, useCallback } from "react";
import { Meal } from "@/lib/db/schema";
import { MealEntry } from "@/components/MealEntry";
import { MealLog } from "@/components/MealLog";
import { TasteProfile } from "@/components/TasteProfile";
import { DiscoveryEngine } from "@/components/DiscoveryEngine";

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [profileKey, setProfileKey] = useState(0);
  const [loadingMeals, setLoadingMeals] = useState(true);

  const fetchMeals = useCallback(async () => {
    try {
      const res = await fetch("/api/meals");
      const data = await res.json();
      setMeals(data);
    } catch (e) {
      console.error("Failed to fetch meals", e);
    } finally {
      setLoadingMeals(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  function handleMealAdded(meal: Meal) {
    setMeals((prev) => [meal, ...prev]);
    setProfileKey((k) => k + 1);
  }

  async function handleDelete(id: number) {
    await fetch(`/api/meals/${id}`, { method: "DELETE" });
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setProfileKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b-2 border-black bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-0">
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-8 border-r-2 border-black py-4 pr-4">
              <h1 className="text-2xl font-mono font-black uppercase tracking-tighter leading-none">
                THE TASTE JOURNAL
              </h1>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
                Personal Food Log / Palate Analysis System v1.0
              </p>
            </div>
            <div className="col-span-4 py-4 pl-4 flex items-center">
              <div className="text-right w-full">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Entries
                </p>
                <p className="text-3xl font-mono font-black tabular-nums">
                  {loadingMeals ? "—" : meals.length.toString().padStart(3, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">

          {/* Left Column: Entry + Profile + Discovery */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <MealEntry onMealAdded={handleMealAdded} />
            <TasteProfile refreshKey={profileKey} />
            <DiscoveryEngine />
          </div>

          {/* Right Column: Meal Log */}
          <div className="col-span-12 lg:col-span-8">
            <MealLog meals={meals} onDelete={handleDelete} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-8 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            The Taste Journal — Local SQLite / Gemini 1.5 Flash
          </p>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Single User Mode
          </p>
        </div>
      </footer>
    </div>
  );
}
