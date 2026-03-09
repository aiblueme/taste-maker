"use client";

import { useState } from "react";
import { FlavorBar } from "./FlavorBar";

const FLAVOR_KEYS = ["sweet", "sour", "salty", "bitter", "umami", "spice"] as const;

interface Suggestion {
  name: string;
  description: string;
  why: string;
  sweet: number;
  sour: number;
  salty: number;
  bitter: number;
  umami: number;
  spice: number;
}

const COUNTRIES = [
  "Japan", "Mexico", "India", "Italy", "Thailand", "China", "France",
  "Ethiopia", "Morocco", "Peru", "Vietnam", "Spain", "South Korea",
  "Turkey", "Lebanon", "Nigeria", "Argentina", "Greece", "Indonesia",
  "Brazil", "Egypt", "Georgia", "Hungary", "Iran", "Malaysia",
];

export function DiscoveryEngine() {
  const [country, setCountry] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ country: string; suggestions: Suggestion[] } | null>(null);
  const [error, setError] = useState("");

  const selectedCountry = country === "__custom" ? customCountry.trim() : country;

  async function handleDiscover() {
    if (!selectedCountry) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Discovery failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-2 border-black bg-white">
      <div className="border-b-2 border-black px-4 py-2 bg-black">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
          Discovery Engine
        </h2>
      </div>
      <div className="p-4">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 leading-relaxed">
          Select a country. Gemini will return 3 dishes matching your palate that you haven&apos;t logged.
        </p>

        <div className="flex gap-0 mb-2">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="flex-1 border-2 border-black border-r-0 px-3 py-2 text-sm font-mono bg-white focus:outline-none appearance-none"
            disabled={loading}
          >
            <option value="">-- SELECT COUNTRY --</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
            <option value="__custom">OTHER (type below)</option>
          </select>
          <button
            onClick={handleDiscover}
            disabled={loading || !selectedCountry}
            className="border-2 border-black bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-none disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "QUERYING..." : "RUN QUERY"}
          </button>
        </div>

        {country === "__custom" && (
          <input
            type="text"
            value={customCountry}
            onChange={(e) => setCustomCountry(e.target.value)}
            placeholder="Enter country name"
            className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white focus:outline-none mb-2"
            disabled={loading}
          />
        )}

        {error && (
          <div className="border-2 border-[#FF0000] px-3 py-2 mt-4">
            <p className="text-xs font-mono text-[#FF0000] uppercase">Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-0">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2 border-b border-black pb-1">
              Recommendations / {result.country.toUpperCase()}
            </p>
            {result.suggestions.map((s, i) => (
              <div key={i} className="border border-black mb-[-1px] p-3 bg-slate-50">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-mono font-bold text-sm uppercase tracking-wide">
                      {i + 1}. {s.name}
                    </p>
                    <p className="text-xs font-mono text-slate-600 mt-1">{s.description}</p>
                    <p className="text-xs font-mono text-slate-400 mt-1 italic">↳ {s.why}</p>
                  </div>
                </div>
                <div className="border border-black p-2 bg-white mt-2">
                  {FLAVOR_KEYS.map((f) => (
                    <FlavorBar key={f} label={f} value={s[f] ?? 0} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
