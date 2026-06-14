'use client';

import { useEffect, useState } from 'react';

/**
 * Tiny "drops friday 6pm" countdown for flair on the drops page.
 * Computes the next Friday 18:00 (local) so it never goes stale, ticks every
 * second, and renders a neutral placeholder until mounted to avoid any
 * SSR/client hydration mismatch.
 */
function msUntilNextFriday6pm(now: Date): number {
  const target = new Date(now);
  // 5 = Friday. Days until the upcoming Friday.
  const day = now.getDay();
  let add = (5 - day + 7) % 7;
  target.setHours(18, 0, 0, 0);
  if (add === 0 && now.getTime() >= target.getTime()) {
    add = 7; // already past 6pm Friday → next week
  }
  target.setDate(now.getDate() + add);
  target.setHours(18, 0, 0, 0);
  return Math.max(0, target.getTime() - now.getTime());
}

function split(ms: number) {
  const total = Math.floor(ms / 1000);
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

export function PopsCountdown() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMs(msUntilNextFriday6pm(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const t = ms == null ? null : split(ms);
  const units: { label: string; value: string }[] = [
    { label: 'days', value: t ? String(t.d) : '–' },
    { label: 'hrs', value: t ? String(t.h).padStart(2, '0') : '––' },
    { label: 'min', value: t ? String(t.m).padStart(2, '0') : '––' },
    { label: 'sec', value: t ? String(t.s).padStart(2, '0') : '––' },
  ];

  return (
    <div
      className="flex gap-2 sm:gap-3"
      role="timer"
      aria-label="Time until the next Friday 6pm drop"
    >
      {units.map((u) => (
        <div
          key={u.label}
          className="min-w-[3.75rem] rounded-2xl border-2 border-pops-black bg-pops-paper px-2 py-2 text-center shadow-pops sm:min-w-[4.5rem] sm:px-3"
        >
          <span className="block font-display text-2xl font-bold leading-none text-pops-black tabular-nums sm:text-3xl">
            {u.value}
          </span>
          <span className="mt-1 block font-display text-[0.6rem] font-bold uppercase text-pops-black/60">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
