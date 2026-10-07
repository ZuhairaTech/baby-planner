import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}: Props) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500">
          {title}
        </p>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-stone-900">
        {value}
      </p>

      {subtitle && (
        <p className="mt-1 text-xs text-stone-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}