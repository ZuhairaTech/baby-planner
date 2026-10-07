import {
  ExternalLink,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";

import { ShoppingItem } from "@/types/shopping";
import { formatRM } from "@/lib/money";

interface Props {
  item: ShoppingItem;
}

function priorityStyle(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-700";
    case "medium":
      return "bg-amber-50 text-amber-700";
    case "low":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-stone-100 text-stone-600";
  }
}

function statusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "bought":
      return "bg-green-100 text-green-800";

    case "wishlist":
      return "bg-purple-100 text-purple-800";

    case "waiting sale":
      return "bg-blue-100 text-blue-800";

    case "comparing":
      return "bg-amber-100 text-amber-800";

    case "not needed":
      return "bg-red-100 text-red-700";

    default:
      return "bg-stone-100 text-stone-600";
  }
}

export default function ItemCard({ item }: Props) {
  const displayPrice =
    item.boughtPrice ?? item.bestPrice ?? item.budget;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {item.category}
          </p>

          <h3 className="text-lg font-bold text-stone-900">
            {item.item}
          </h3>

          {item.brand && (
            <p className="mt-1 text-sm text-stone-500">
              {item.brand}
            </p>
          )}
        </div>

        {item.priority && (
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle(
              item.priority
            )}`}
          >
            {item.priority}
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-stone-600">
        {item.qty && (
          <div className="flex items-center gap-2">
            <Package size={15} />
            Qty: {item.qty}
          </div>
        )}

        {item.neededBy && (
          <div className="flex items-center gap-2">
            <MapPin size={15} />
            {item.neededBy}
          </div>
        )}

        {item.store && (
          <div className="flex items-center gap-2">
            <ShoppingBag size={15} />
            {item.store}
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-stone-100 pt-4">
        <p className="text-xs text-stone-400">
          {item.boughtPrice
            ? "Bought for"
            : item.bestPrice
            ? "Best price"
            : "Budget"}
        </p>

        <p className="text-xl font-bold text-stone-900">
          {formatRM(displayPrice)}
        </p>
      </div>

      {item.note && (
        <div className="mt-4 rounded-2xl bg-stone-50 p-3 text-xs leading-5 text-stone-600">
          {item.note}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(
            item.status
          )}`}
        >
          {item.status || "No Status"}
        </span>

        {item.link && item.link.startsWith("http") && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Shop
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}