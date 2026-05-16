"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { FuelRecord } from "@/lib/types";
import {
  EfficiencyTier,
  classifyEfficiency,
  formatDate,
  formatMXN,
} from "@/lib/calculations";
import { useRef, useState } from "react";

const tierColor: Record<EfficiencyTier, "success" | "warning" | "danger" | "default"> = {
  good: "success",
  average: "warning",
  poor: "danger",
  none: "default",
};

const tierLabel: Record<EfficiencyTier, string> = {
  good: "Eficiente",
  average: "Promedio",
  poor: "Bajo",
  none: "Sin datos",
};

interface Props {
  record: FuelRecord;
  avgEfficiency: number;
  onDelete: (id: string) => void;
}

export function RecordCard({ record, avgEfficiency, onDelete }: Props) {
  const tier = classifyEfficiency(record.efficiency, avgEfficiency);
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState(0);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const dragging = useRef(false);

  const MAX_OFFSET = 96;
  const OPEN_THRESHOLD = 56;

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragging.current = false;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (startX.current === null || startY.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!dragging.current) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        dragging.current = true;
      } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        startX.current = null;
        return;
      }
    }
    if (dragging.current) {
      const next = Math.max(-MAX_OFFSET, Math.min(0, offset + (dx < 0 ? dx : dx * 0.3)));
      setOffset(next);
    }
  }
  function onTouchEnd() {
    if (dragging.current) {
      setOffset(offset < -OPEN_THRESHOLD ? -MAX_OFFSET : 0);
    }
    startX.current = null;
    startY.current = null;
    dragging.current = false;
  }

  function handleCardClick() {
    if (offset < 0) {
      setOffset(0);
      return;
    }
    setExpanded((v) => !v);
  }

  return (
    <div
      className="swipe-container rounded-2xl"
      style={{ backgroundColor: offset < 0 ? "#EF4444" : "transparent" }}
    >
      {offset < 0 && (
        <button
          aria-label="Eliminar registro"
          onClick={() => onDelete(record.id)}
          className="absolute right-0 top-0 h-full w-24 flex items-center justify-center text-white font-semibold tap-target"
        >
          Eliminar
        </button>
      )}

      <div
        className="swipe-content"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Card
          isPressable
          onPress={handleCardClick}
          className="w-full rounded-2xl shadow-sm border border-default-100 bg-white"
        >
          <CardBody className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-default-500">
                    {formatDate(record.date)}
                  </p>
                  {record.station && (
                    <span className="text-xs text-default-400 truncate">
                      · {record.station}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formatMXN(record.totalCost)}
                </p>
                <p className="text-xs text-default-500 mt-0.5">
                  {record.liters.toFixed(2)} L · {formatMXN(record.pricePerLiter)}/L
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <Chip
                  size="sm"
                  color={tierColor[tier]}
                  variant="flat"
                  className="font-semibold"
                >
                  {record.efficiency && record.efficiency > 0
                    ? `${record.efficiency.toFixed(2)} km/L`
                    : "—"}
                </Chip>
                <span className="text-[10px] uppercase tracking-wider text-default-400">
                  {tierLabel[tier]}
                </span>
              </div>
            </div>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-default-100 grid grid-cols-2 gap-3 text-sm">
                <Detail
                  label="Odómetro"
                  value={`${record.odometer.toLocaleString("es-MX")} km`}
                />
                <Detail
                  label="Km recorridos"
                  value={
                    record.kmDriven != null
                      ? `${record.kmDriven.toLocaleString("es-MX")} km`
                      : "—"
                  }
                />
                <Detail label="Litros" value={`${record.liters.toFixed(2)} L`} />
                <Detail
                  label="Precio/L"
                  value={formatMXN(record.pricePerLiter)}
                />
                {record.station && (
                  <Detail label="Gasolinera" value={record.station} />
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-default-400">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}
