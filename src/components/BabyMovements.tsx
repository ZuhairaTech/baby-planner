
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Check,
  ChevronDown,
  Heart,
  History,
  Loader2,
  RefreshCw,
} from "lucide-react";

type MovementType =
  | "Kick"
  | "Flutter"
  | "Wriggle"
  | "Roll"
  | "Stretch";

type Movement = {
  date: string;
  time: string;
  type: string;
  minutes: number;
  group: string;
  count: number;
};


const movementTypes: { name: MovementType; emoji: string }[] = [
  { name: "Kick", emoji: "🦶" },
  { name: "Flutter", emoji: "🦋" },
  { name: "Wriggle", emoji: "〰️" },
  { name: "Roll", emoji: "🔄" },
  { name: "Stretch", emoji: "🙆" },
];

function malaysiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}


function timeToSeconds(time: string): number {
  const value = time.trim();

  // Supports 9:24:00 AM, 3:01:00 PM and 15:01:00
  const match = value.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i
  );

  if (!match) return 0;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);
  const period = match[4]?.toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 3600 + minutes * 60 + seconds;
}


export default function BabyMovements() {
  const [type, setType] = useState<MovementType>("Kick");
  const [group, setGroup] = useState<"New" | "Same">("New");
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(malaysiaDate());


  async function loadMovements() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/movements", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load movements");
      }

      setMovements(data.movements || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
  }, []);

  const today = malaysiaDate();
  const todayMovements = movements
  .filter((item) => item.date === today)
  .sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));

  const last = todayMovements.at(-1);
  const totalGroups = last?.count ?? 0;

  const selectedMovements = movements
    .filter((item) => item.date === selectedDate)
    .sort(
        (a, b) =>
        timeToSeconds(b.time) - timeToSeconds(a.time)
    );


  async function saveMovement() {
    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, group }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save movement");
      }

      setMessage(`${type} saved successfully!`);
      setGroup("Same");
      await loadMovements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5">
        <div className="mb-4 flex items-center gap-2 text-rose-600">
          <Heart size={18} />
          <span className="text-sm font-semibold">
            Baby Movement Journal
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-stone-500">
              Today's groups
            </p>
            <p className="mt-2 text-3xl font-bold">
              {totalGroups}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-stone-500">
              Last movement
            </p>
            <p className="mt-2 text-xl font-bold">
              {last?.time || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-xl font-bold">
          Record a movement
        </h2>
        <p className="mb-5 text-sm text-stone-500">
          Select what you felt. The date and time are recorded automatically.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {movementTypes.map((movement) => (
            <button
              key={movement.name}
              type="button"
              onClick={() => setType(movement.name)}
              className={`rounded-2xl border p-3 text-center transition ${
                type === movement.name
                  ? "border-rose-400 bg-rose-50"
                  : "border-stone-200 bg-white"
              }`}
            >
              <span className="block text-2xl">
                {movement.emoji}
              </span>
              <span className="mt-2 block text-xs font-semibold">
                {movement.name}
              </span>
            </button>
          ))}
        </div>

        <h3 className="mb-3 mt-6 font-semibold">
          Movement group
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {(["New", "Same"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setGroup(value)}
              className={`rounded-2xl border p-4 text-sm font-semibold ${
                group === value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-stone-200 text-stone-600"
              }`}
            >
              {value === "New" ? "New group" : "Same group"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={saveMovement}
          disabled={saving || loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 p-4 font-bold text-white disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            <>
              <Check size={18} />
              Save {type}
            </>
          )}
        </button>

        {message && (
          <p role="status" className="mt-3 text-center text-sm text-emerald-700">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

            
        {/* MOVEMENT HISTORY - MOBILE FRIENDLY */}
        <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">

        {/* Collapsible header */}
        <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            aria-expanded={showHistory}
            aria-controls="movement-history-content"
            className="flex min-h-14 w-full items-center justify-between gap-3 text-left"
        >
            <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                <History size={21} className="text-rose-500" />
            </div>

            <div className="min-w-0">
                <h2 className="text-base font-bold text-stone-900">
                Movement History
                </h2>
                <p className="text-xs text-stone-500">
                {showHistory
                    ? `${selectedMovements.length} entries`
                    : "Tap to view your movement records"}
                </p>
            </div>
            </div>

            <ChevronDown
            size={21}
            className={`shrink-0 text-stone-500 transition-transform ${
                showHistory ? "rotate-180" : ""
            }`}
            />
        </button>

        {/* Expanded content */}
        {showHistory && (
            <div
            id="movement-history-content"
            className="mt-4 border-t border-stone-100 pt-4"
            >
            {/* Date selector */}
            <label
                htmlFor="movement-date"
                className="mb-2 block text-sm font-semibold text-stone-700"
            >
                Select date
            </label>

            <input
                id="movement-date"
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block min-h-12 w-full min-w-0 max-w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-base text-stone-900 outline-none focus:border-rose-400"
            />

            {/* Entries count and refresh */}
            <div className="mt-4 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-stone-700">
                {selectedMovements.length} movements
                </p>

                <button
                type="button"
                onClick={loadMovements}
                disabled={loading}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-stone-100 px-3 text-sm font-medium text-stone-700 disabled:opacity-50"
                >
                <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                />
                Refresh
                </button>
            </div>

            {/* Movement list */}
            <div className="mt-4 space-y-2">
                {loading ? (
                <p className="py-8 text-center text-sm text-stone-500">
                    Loading movements...
                </p>
                ) : selectedMovements.length === 0 ? (
                <div className="rounded-2xl bg-stone-50 px-4 py-8 text-center">
                    <p className="text-sm text-stone-500">
                    No movements recorded for this date.
                    </p>
                </div>
                ) : (
                selectedMovements.map((movement, index) => (
                    <div
                    key={`${movement.date}-${movement.time}-${index}`}
                    className="flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl bg-stone-50 p-3 sm:p-4"
                    >
                    <div className="flex min-w-0 items-center gap-3">
                        <Activity
                        size={18}
                        className="shrink-0 text-rose-500"
                        />

                        <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900">
                            {movement.type}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                            {movement.time} · {movement.group} group
                        </p>
                        </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                        #{movement.count}
                    </span>
                    </div>
                ))
                )}
            </div>
            </div>
        )}
        </section>

      <p className="text-center text-xs leading-5 text-stone-500">
        This journal is for recording movements, not assessing fetal
        wellbeing. Follow your maternity team's guidance about changes
        in your baby's usual movement pattern.
      </p>
    </section>
  );
}
