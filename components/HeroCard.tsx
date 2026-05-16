"use client";

import { Card, CardBody } from "@heroui/react";
import { Stats } from "@/lib/calculations";
import { formatMXN, formatDate } from "@/lib/calculations";

export function HeroCard({ stats }: { stats: Stats }) {
  return (
    <Card className="gradient-hero text-white shadow-xl shadow-purple-300/40 rounded-3xl overflow-hidden">
      <CardBody className="p-6">
        <p className="text-xs uppercase tracking-widest text-white/70 font-medium">
          Total gastado
        </p>
        <h1 className="text-4xl font-bold mt-1 tracking-tight">
          {formatMXN(stats.totalSpent)}
        </h1>
        <p className="text-sm text-white/80 mt-1">
          Este mes: <span className="font-semibold">{formatMXN(stats.monthSpent)}</span>
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Metric
            label="Rendimiento prom."
            value={
              stats.avgEfficiency > 0
                ? `${stats.avgEfficiency.toFixed(2)}`
                : "—"
            }
            suffix="km/L"
          />
          <Metric
            label="Litros totales"
            value={stats.totalLiters.toFixed(1)}
            suffix="L"
          />
        </div>

        {stats.lastDate && (
          <div className="mt-5 pt-5 border-t border-white/20">
            <p className="text-xs uppercase tracking-wider text-white/60">
              Último llenado
            </p>
            <p className="text-sm mt-1 text-white/90">
              {formatDate(stats.lastDate)} ·{" "}
              <span className="font-semibold">
                {stats.lastOdometer?.toLocaleString("es-MX")} km
              </span>
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div>
      <p className="text-xs text-white/70 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold mt-0.5">
        {value}
        <span className="text-sm font-medium text-white/70 ml-1">{suffix}</span>
      </p>
    </div>
  );
}
