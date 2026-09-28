'use client';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';

export default function WorldClock() {
  const [times, setTimes] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimes(
        site.regions.map((r) =>
          new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: r.tz }).format(now)
        )
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
      {site.regions.map((r, i) => (
        <div key={r.name} className="bg-surface px-5 py-6">
          <p className="label-tech">{r.name}</p>
          <p className="mt-3 font-display text-[clamp(1.3rem,2vw,1.7rem)] font-semibold tabular-nums tracking-tight text-ink">
            {times[i] ? times[i] : <span aria-hidden className="inline-block h-[0.95em] w-[5ch] rounded-md bg-line" />}
          </p>
          <p className="mt-1 text-[12.5px] text-faint">{r.city}</p>
        </div>
      ))}
    </div>
  );
}
