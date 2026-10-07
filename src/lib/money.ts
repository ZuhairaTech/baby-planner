export function parseMoney(value?: string): number | null {
  if (!value) return null;

  const cleaned = value
    .replace(/RM/gi, "")
    .replace(/,/g, "")
    .trim();

  if (!cleaned) return null;

  const number = Number(cleaned);

  return Number.isNaN(number) ? null : number;
}

export function formatRM(value?: number | null) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}