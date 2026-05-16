"use client";

import { Card, CardBody } from "@heroui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FuelRecord } from "@/lib/types";
import { formatShortDate } from "@/lib/calculations";

interface Props {
  records: FuelRecord[];
  avgEfficiency: number;
}

export function EfficiencyChart({ records, avgEfficiency }: Props) {
  const data = records
    .filter((r) => r.efficiency && r.efficiency > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10)
    .map((r) => ({
      date: formatShortDate(r.date),
      eff: r.efficiency || 0,
    }));

  if (data.length < 2) {
    return null;
  }

  return (
    <Card className="rounded-3xl shadow-sm border border-default-100 bg-white">
      <CardBody className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Rendimiento</h3>
            <p className="text-xs text-default-500 mt-0.5">
              Últimos {data.length} llenados · prom.{" "}
              <span className="text-primary-600 font-semibold">
                {avgEfficiency.toFixed(2)} km/L
              </span>
            </p>
          </div>
        </div>
        <div className="h-48 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEAFA" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                cursor={{ fill: "#F5F0FF" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #EADDFF",
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v.toFixed(2)} km/L`, "Rendimiento"]}
              />
              <ReferenceLine
                y={avgEfficiency}
                stroke="#7C3AED"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Bar dataKey="eff" radius={[8, 8, 0, 0]}>
                {data.map((entry, i) => {
                  const color =
                    entry.eff >= avgEfficiency * 1.05
                      ? "#16A34A"
                      : entry.eff >= avgEfficiency * 0.95
                      ? "#F59E0B"
                      : "#EF4444";
                  return <Cell key={i} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
