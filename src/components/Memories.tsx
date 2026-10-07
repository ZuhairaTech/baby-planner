"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Images,
} from "lucide-react";
import Image from "next/image";

const memories = [
  {
    image: "/memories/scan-01.jpg",
    title: "Our first scan",
    date: "2026",
    description: "The first little glimpse of you ♡",
  },

  {
    image: "/memories/scan-02.jpg",
    title: "Growing little by little",
    date: "2026",
    description: "",
  },

  {
    image: "/memories/scan-03.jpg",
    title: "Another little memory",
    date: "2026",
    description: "",
  },
];

export default function Memories() {
  const [current, setCurrent] = useState(0);

  const previous = () => {
    setCurrent((current) =>
      current === 0
        ? memories.length - 1
        : current - 1
    );
  };

  const next = () => {
    setCurrent((current) =>
      current === memories.length - 1
        ? 0
        : current + 1
    );
  };

  const memory = memories[current];

  return (
    <section>
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-500">
          <Heart size={16} fill="currentColor" />
          Our little journey
        </div>

        <h2 className="text-2xl font-bold text-stone-900">
          Memories
        </h2>

        <p className="mt-1 text-sm text-stone-500">
          Little moments we want to remember forever.
        </p>
      </div>

      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">

        {/* IMAGE */}

        <div className="relative aspect-[4/3] bg-stone-100">
          <Image
            src={memory.image}
            alt={memory.title}
            fill
            className="object-contain"
            priority
          />

          {/* PREVIOUS */}

          <button
            onClick={previous}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur"
            aria-label="Previous memory"
          >
            <ChevronLeft size={20} />
          </button>

          {/* NEXT */}

          <button
            onClick={next}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur"
            aria-label="Next memory"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* MEMORY INFORMATION */}

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                {memory.title}
              </h3>

              {memory.description && (
                <p className="mt-1 text-sm text-stone-500">
                  {memory.description}
                </p>
              )}
            </div>

            <span className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
              {memory.date}
            </span>
          </div>

          {/* DOT INDICATORS */}

          <div className="mt-5 flex justify-center gap-1.5">
            {memories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Memory ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  current === index
                    ? "w-6 bg-rose-400"
                    : "w-2 bg-stone-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
        <Images size={14} />

        {current + 1} of {memories.length}
      </div>
    </section>
  );
}