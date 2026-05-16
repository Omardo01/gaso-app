"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { FuelRecord } from "@/lib/types";
import {
  loadData,
  recomputeDerived,
  saveData,
  sortByDateDesc,
} from "@/lib/storage";
import { computeStats } from "@/lib/calculations";
import { HeroCard } from "@/components/HeroCard";
import { RecordCard } from "@/components/RecordCard";
import { AddRecordModal } from "@/components/AddRecordModal";
import { EfficiencyChart } from "@/components/EfficiencyChart";
import { EmptyState } from "@/components/EmptyState";
import { Toast } from "@/components/Toast";

export default function HomePage() {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { isOpen: modalOpen, onOpen, onClose } = useDisclosure();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const data = loadData();
    setRecords(data.records);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveData({ records });
  }, [records, hydrated]);

  const stats = useMemo(() => computeStats(records), [records]);
  const sortedForList = useMemo(() => sortByDateDesc(records), [records]);

  const handleSave = useCallback(
    (record: FuelRecord) => {
      setRecords((prev) => recomputeDerived([...prev, record]));
      onClose();
      setToast("Llenado guardado");
    },
    [onClose]
  );

  const handleDelete = useCallback((id: string) => {
    setRecords((prev) => recomputeDerived(prev.filter((r) => r.id !== id)));
    setToast("Registro eliminado");
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFB] pb-40">
      <Toast message={toast} onDismiss={() => setToast(null)} />

      <div className="max-w-md mx-auto px-4 pt-6">
        <header className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GasoApp</h1>
            <p className="text-xs text-default-500">Tu gasolina, bajo control</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-600" fill="currentColor">
              <path d="M3 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16h2v-7h-1V8.41l2.3 2.3a1 1 0 0 1 .3.7V18a1 1 0 0 0 2 0V8a1 1 0 0 0-.3-.7l-3-3-1.4 1.4 1.7 1.7v3.18A2 2 0 0 0 18 12h1v6a3 3 0 0 1-6 0v-1h-2v4H3Zm2-2h8V5H5v14Zm2-12h4v4H7V7Z" />
            </svg>
          </div>
        </header>

        <HeroCard stats={stats} />

        {hydrated && records.length === 0 ? (
          <EmptyState onAdd={onOpen} />
        ) : (
          <>
            <section className="mt-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-bold text-foreground">Historial</h2>
                <span className="text-xs text-default-500">
                  {records.length} {records.length === 1 ? "llenado" : "llenados"}
                </span>
              </div>
              <ul className="flex flex-col gap-3">
                {sortedForList.map((r) => (
                  <li key={r.id}>
                    <RecordCard
                      record={r}
                      avgEfficiency={stats.avgEfficiency}
                      onDelete={handleDelete}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <EfficiencyChart
                records={records}
                avgEfficiency={stats.avgEfficiency}
              />
            </section>
          </>
        )}
      </div>

      <Button
        isIconOnly
        aria-label="Agregar llenado"
        onPress={onOpen}
        radius="full"
        size="lg"
        className={`fixed z-30 right-6 w-16 h-16 min-w-16 !bg-primary-600 !text-white shadow-2xl shadow-primary-500/50 transition-opacity ${
          modalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 24px)" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Button>

      <AddRecordModal
        isOpen={modalOpen}
        onClose={onClose}
        onSave={handleSave}
      />
    </main>
  );
}
