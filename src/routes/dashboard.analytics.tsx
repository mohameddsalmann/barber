import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { revenueWeek, topServices, barberPerformance } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { Pill } from "@/components/badges";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Owner Dashboard" }] }),
  component: Analytics,
});

const HOURS = ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Analytics() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");

  // Heatmap intensity
  const heat = DAYS.map((d, di) =>
    HOURS.map((h, hi) => {
      const isWeekend = di >= 5;
      const peak = (hi >= 3 && hi <= 5) || (hi >= 8 && hi <= 10);
      let v = 0.1 + Math.random() * 0.3;
      if (peak) v += 0.4;
      if (isWeekend) v += 0.2;
      return Math.min(1, v);
    })
  );

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">The shape of your business.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg">Revenue Over Time</h2>
            <div className="flex gap-2">
              {(["day","week","month"] as const).map((p) => <Pill key={p} active={period === p} onClick={() => setPeriod(p)}>{p[0].toUpperCase() + p.slice(1)}</Pill>)}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={revenueWeek} margin={{ left: -12 }}>
                <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#A1A1AA" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#16161A", border: "1px solid #27272A", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} dot={{ fill: "#D4AF37", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Retention Rate</div>
          <div className="mt-3 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#27272A" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#D4AF37" strokeWidth="10" strokeDasharray={`${0.78 * 264} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-3xl">78%</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">90-day</div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            +6% vs previous period
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg mb-4">Busiest Hours</h2>
          <div className="overflow-x-auto">
            <div className="inline-block">
              <div className="flex">
                <div className="w-10" />
                {HOURS.map((h) => <div key={h} className="w-7 text-center text-[10px] text-muted-foreground font-mono">{h}</div>)}
              </div>
              {DAYS.map((d, di) => (
                <div key={d} className="flex items-center mt-1">
                  <div className="w-10 text-[10px] text-muted-foreground font-display">{d}</div>
                  {heat[di].map((v, hi) => (
                    <div key={hi} className="w-7 h-7 m-px rounded" style={{ backgroundColor: `rgba(212,175,55,${v.toFixed(2)})` }} title={`${v.toFixed(2)}`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg mb-4">Top Services</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topServices} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#A1A1AA" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#A1A1AA" fontSize={11} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ backgroundColor: "#16161A", border: "1px solid #27272A", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {topServices.map((_, i) => <Cell key={i} fill={i % 2 ? "#F43F5E" : "#D4AF37"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg mb-4">Barber Performance</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={barberPerformance} margin={{ left: -12 }}>
              <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#A1A1AA" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="#A1A1AA" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#16161A", border: "1px solid #27272A", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              <Bar dataKey="clients" fill="#F43F5E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageShell>
  );
}
