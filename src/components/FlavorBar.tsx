"use client";

interface FlavorBarProps {
  label: string;
  value: number; // 1-10
  maxValue?: number;
}

export function FlavorBar({ label, value, maxValue = 10 }: FlavorBarProps) {
  const pct = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className="flex items-center gap-0 mb-[1px]">
      <span className="w-16 text-xs font-mono uppercase tracking-widest text-black border-r border-black pr-2 py-1 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-6 border-r border-black relative bg-white">
        <div
          className="h-full bg-black"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs font-mono text-right pl-1 tabular-nums">
        {typeof value === "number" ? value.toFixed(1) : "—"}
      </span>
    </div>
  );
}
