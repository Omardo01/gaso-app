import { FuelRecord } from "./types";

export interface Stats {
  totalSpent: number;
  monthSpent: number;
  avgEfficiency: number;
  totalLiters: number;
  lastDate: string | null;
  lastOdometer: number | null;
}

export function computeStats(records: FuelRecord[]): Stats {
  if (records.length === 0) {
    return {
      totalSpent: 0,
      monthSpent: 0,
      avgEfficiency: 0,
      totalLiters: 0,
      lastDate: null,
      lastOdometer: null,
    };
  }
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let totalSpent = 0;
  let monthSpent = 0;
  let totalLiters = 0;
  let effSum = 0;
  let effCount = 0;

  for (const r of records) {
    totalSpent += r.totalCost;
    totalLiters += r.liters;
    if (r.date.startsWith(ym)) monthSpent += r.totalCost;
    if (r.efficiency && r.efficiency > 0) {
      effSum += r.efficiency;
      effCount += 1;
    }
  }

  const sortedByDate = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const last = sortedByDate[0];

  return {
    totalSpent,
    monthSpent,
    avgEfficiency: effCount > 0 ? effSum / effCount : 0,
    totalLiters,
    lastDate: last.date,
    lastOdometer: last.odometer,
  };
}

export type EfficiencyTier = "good" | "average" | "poor" | "none";

export function classifyEfficiency(
  eff: number | null,
  avg: number
): EfficiencyTier {
  if (!eff || eff <= 0 || avg <= 0) return "none";
  const ratio = eff / avg;
  if (ratio >= 1.05) return "good";
  if (ratio >= 0.95) return "average";
  return "poor";
}

export function formatMXN(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
  }).format(d);
}

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
