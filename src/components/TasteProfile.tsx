"use client";

import { useEffect, useState } from "react";
import { FlavorBar } from "./FlavorBar";

interface Profile {
  count: number;
  profile: Record<string, number> | null;
  dominantFlavor?: string;
  message?: string;
}

const FLAVOR_KEYS = ["sweet", "sour", "salty", "bitter", "umami", "spice"] as const;

export function TasteProfile({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="border-2 border-black bg-white">
      <div className="border-b-2 border-black px-4 py-2 bg-black flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
          Average Palate
        </h2>
        {data?.count ? (
          <span className="text-xs font-mono text-slate-400">
            n={data.count} (rated ≥7)
          </span>
        ) : null}
      </div>

      <div className="p-4">
        {loading && (
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Computing...
          </p>
        )}

        {!loading && (!data?.profile) && (
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest leading-relaxed">
            {data?.message || "No data. Rate meals ≥7 to build your profile."}
          </p>
        )}

        {!loading && data?.profile && (
          <>
            {data.dominantFlavor && (
              <div className="mb-4 border border-black px-3 py-2 bg-slate-50">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  Dominant Signature
                </p>
                <p className="text-lg font-mono font-bold uppercase tracking-widest">
                  {data.dominantFlavor}
                </p>
              </div>
            )}
            <div className="border border-black p-2">
              {FLAVOR_KEYS.map((f) => (
                <FlavorBar
                  key={f}
                  label={f}
                  value={data.profile![f] ?? 0}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
