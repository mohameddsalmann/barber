import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { barberEarningsWeek, services } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { Pill } from "@/components/badges";
import { useWindowSize } from "@/hooks/use-window-size";

export const Route = createFileRoute("/barber/earnings")({
  head: () => ({ meta: [{ title: "Earnings — Barber App" }] }),
  component: BarberEarnings,
});

function BarberEarnings() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  const serviceBreakdown = [
    { service: "Haircut", count: 8, earned: 200 },
    { service: "Fade", count: 5, earned: 175 },
    { service: "Beard Trim", count: 4, earned: 80 },
    { service: "Hair + Beard", count: 3, earned: 150 },
    { service: "Kids Cut", count: 2, earned: 36 },
  ];

  return (
    <PageShell>
      <div className={isDesktop ? "p-6 max-w-[1200px] mx-auto" : "px-5 pt-5"}>
        <h1 className="text-2xl mb-3">Earnings</h1>
        <div className="flex gap-2 mb-5">
          <Pill active={period === "week"} onClick={() => setPeriod("week")}>This Week</Pill>
          <Pill active={period === "month"} onClick={() => setPeriod("month")}>This Month</Pill>
        </div>

        <div className={isDesktop ? "grid grid-cols-4 gap-3 mb-5" : "grid grid-cols-3 gap-2 mb-5"}>
          <Card label="Earned" value="$1,620" />
          <Card label="Tips" value="$184" accent />
          <Card label="Commission" value="$972" />
          {isDesktop && <Card label="Avg per Cut" value="$38" />}
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 mb-5">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Daily breakdown</h2>
          <div className={isDesktop ? "h-64" : "h-48"}>
            <ResponsiveContainer>
              <BarChart data={barberEarningsWeek} margin={{ left: -18, top: 8 }}>
                <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#A1A1AA" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#16161A", border: "1px solid #27272A", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="earned" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-service breakdown table (desktop enhancement) */}
        {isDesktop && (
          <div className="mb-5">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Per-service breakdown</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-center">Count</th>
                    <th className="px-4 py-3 text-right">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceBreakdown.map((row) => (
                    <tr key={row.service} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-display">{row.service}</td>
                      <td className="px-4 py-3 text-center font-mono">{row.count}</td>
                      <td className="px-4 py-3 text-right font-mono text-primary">${row.earned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Recent payouts</h2>
        <div className="space-y-2">
          {[
            { d: "Apr 22", amt: 1276 },
            { d: "Apr 15", amt: 1184 },
            { d: "Apr 08", amt: 1340 },
            { d: "Apr 01", amt: 1090 },
          ].map((p) => (
            <div key={p.d} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-display text-sm">Weekly Payout</div>
                <div className="text-[11px] text-muted-foreground font-mono">{p.d}, 2026</div>
              </div>
              <div className="font-mono text-lg text-primary">${p.amt}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function Card({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-center">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-lg mt-1" style={{ color: accent ? "#D4AF37" : "#FAFAFA" }}>{value}</div>
    </div>
  );
}
