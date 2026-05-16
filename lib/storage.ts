import { FuelRecord, GasoAppData, STORAGE_KEY } from "./types";

const EMPTY: GasoAppData = { records: [] };

export function loadData(): GasoAppData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.records)) return EMPTY;
    return parsed as GasoAppData;
  } catch {
    return EMPTY;
  }
}

export function saveData(data: GasoAppData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function sortByOdometerAsc(records: FuelRecord[]): FuelRecord[] {
  return [...records].sort((a, b) => a.odometer - b.odometer);
}

export function sortByDateDesc(records: FuelRecord[]): FuelRecord[] {
  return [...records].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (db !== da) return db - da;
    return b.odometer - a.odometer;
  });
}

/**
 * Recalcula kmDriven y efficiency en todos los registros tras una inserción o eliminación.
 * Se calcula contra el registro anterior por odómetro.
 */
export function recomputeDerived(records: FuelRecord[]): FuelRecord[] {
  const sorted = sortByOdometerAsc(records);
  return sorted.map((r, i) => {
    if (i === 0) {
      return { ...r, kmDriven: null, efficiency: null };
    }
    const prev = sorted[i - 1];
    const km = r.odometer - prev.odometer;
    const eff = r.liters > 0 ? km / r.liters : 0;
    return {
      ...r,
      kmDriven: km > 0 ? km : 0,
      efficiency: km > 0 ? Number(eff.toFixed(2)) : 0,
    };
  });
}
