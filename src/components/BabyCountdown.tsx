"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Heart } from "lucide-react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function BabyCountdown() {
  const targetDate = new Date("2027-01-09T00:00:00+08:00");

  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateCountdown() {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setCountdown({
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),

        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),

        seconds: Math.floor(
          (difference / 1000) % 60
        ),
      });
    }

    calculateCountdown();

    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-white to-emerald-50 p-6 shadow-sm ring-1 ring-stone-200">
      <Heart
        className="absolute -right-5 -top-5 text-rose-100"
        size={120}
        fill="currentColor"
      />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-500">
          <Heart size={16} fill="currentColor" />
          Until we meet you
        </div>

        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight text-stone-900">
            {countdown.days}
          </span>

          <span className="pb-1 text-stone-500">
            days to go
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <TimeBox
            value={countdown.hours}
            label="Hours"
          />

          <TimeBox
            value={countdown.minutes}
            label="Minutes"
          />

          <TimeBox
            value={countdown.seconds}
            label="Seconds"
          />
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm text-stone-500">
          <CalendarDays size={16} />

          <span>9 January 2027</span>
        </div>
      </div>
    </section>
  );
}

function TimeBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/70 p-3 text-center backdrop-blur">
      <p className="text-xl font-bold text-stone-800">
        {String(value).padStart(2, "0")}
      </p>

      <p className="mt-1 text-[11px] text-stone-400">
        {label}
      </p>
    </div>
  );
}