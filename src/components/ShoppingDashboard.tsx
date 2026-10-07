"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Baby,
  CheckCircle2,
  CircleDollarSign,
  RefreshCw,
  Search,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";

import ItemCard from "./ItemCard";
import StatCard from "./StatCard";

import { ShoppingItem } from "@/types/shopping";
import { formatRM } from "@/lib/money";

export default function ShoppingDashboard() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/shopping", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load data");
      }

      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(items.map((item) => item.category))
      ).sort(),
    ];
  }, [items]);

  const statuses = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          items
            .map((item) => item.status)
            .filter(Boolean)
        )
      ).sort(),
    ];
  }, [items]);

  const boughtItems = items.filter(
    (item) => item.status.toLowerCase() === "bought"
  );

  const highPriority = items.filter(
    (item) =>
      item.priority.toLowerCase() === "high" &&
      item.status.toLowerCase() !== "bought" &&
      item.status.toLowerCase() !== "not needed"
  );

  const spent = boughtItems.reduce(
    (total, item) => total + (item.boughtPrice ?? 0),
    0
  );

  const estimatedRemaining = items
    .filter(
      (item) =>
        item.status.toLowerCase() !== "bought" &&
        item.status.toLowerCase() !== "not needed"
    )
    .reduce(
      (total, item) =>
        total + (item.bestPrice ?? item.budget ?? 0),
      0
    );

  const activeItems = items.filter(
    (item) => item.status.toLowerCase() !== "not needed"
  );

  const progress =
    activeItems.length > 0
      ? Math.round(
          (boughtItems.length / activeItems.length) * 100
        )
      : 0;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.item
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.brand
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.store
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        item.category === category;

      const matchesStatus =
        status === "All" ||
        item.status === status;

      const matchesPriority =
        priority === "All" ||
        item.priority === priority;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [items, search, category, status, priority]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 animate-spin" />
          <p className="text-stone-500">
            Loading baby planner...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <TriangleAlert className="mx-auto mb-3 text-red-500" />

          <h1 className="font-bold">
            Unable to load Google Sheet
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            {error}
          </p>

          <button
            onClick={loadItems}
            className="mt-5 rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f3]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <header className="mb-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Baby size={18} />
                A to Z Planner
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Baby Preparation
              </h1>

              <p className="mt-2 text-stone-500">
                Everything we need before and after baby arrives.
              </p>
            </div>

            <button
              onClick={loadItems}
              className="flex w-fit items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50"
            >
              <RefreshCw size={16} />
              Refresh Sheet
            </button>
          </div>
        </header>

        {/* STATS */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            title="Total items"
            value={String(items.length)}
            subtitle="In shopping list"
            icon={<ShoppingBag size={20} />}
          />

          <StatCard
            title="Bought"
            value={`${boughtItems.length}`}
            subtitle={`${progress}% prepared`}
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            title="Spent"
            value={formatRM(spent)}
            subtitle="Actual bought price"
            icon={<CircleDollarSign size={20} />}
          />

          <StatCard
            title="Estimated left"
            value={formatRM(estimatedRemaining)}
            subtitle="Based on prices entered"
            icon={<Baby size={20} />}
          />
        </section>

        {/* PROGRESS */}

        <section className="mt-5 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex justify-between">
            <div>
              <h2 className="font-bold text-stone-900">
                Preparation progress
              </h2>

              <p className="text-sm text-stone-500">
                {boughtItems.length} of {activeItems.length} needed items bought
              </p>
            </div>

            <span className="font-bold text-emerald-700">
              {progress}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* HIGH PRIORITY */}

        {highPriority.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <TriangleAlert
                size={20}
                className="text-red-500"
              />

              <h2 className="text-xl font-bold text-stone-900">
                High Priority
              </h2>

              <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                {highPriority.length}
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3">
              {highPriority.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="min-w-[260px] rounded-2xl border border-red-100 bg-white p-4"
                >
                  <p className="text-xs font-semibold text-red-500">
                    {item.neededBy || "No deadline"}
                  </p>

                  <p className="mt-1 font-bold text-stone-900">
                    {item.item}
                  </p>

                  <p className="mt-2 text-sm text-stone-500">
                    {item.category}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FILTER */}

        <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="relative mb-3">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search item, brand or store..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white p-3 text-sm"
            >
              {categories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white p-3 text-sm"
            >
              {statuses.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white p-3 text-sm"
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </section>

        {/* SHOPPING LIST */}

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Shopping List
              </h2>

              <p className="text-sm text-stone-500">
                {filteredItems.length} items shown
              </p>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-stone-500">
              No items found.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}