export interface FuelRecord {
  id: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  kmDriven: number | null;
  efficiency: number | null;
  station?: string;
}

export interface GasoAppData {
  records: FuelRecord[];
}

export const STORAGE_KEY = "gasoapp_v2";
