import { createFileRoute, Link } from "@tanstack/react-router";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DollarSign, Calendar, Users, Clock } from "lucide-react";
import { barbers, todayQueue, getService, revenueWeek } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";
import { StatusBadge } from "@/components/badges";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "Overview — Owner Dashboard" }],
  }),
  component: Overview,
});

const kpis = [
  { label: "Today's Revenue", value: "$1,840", icon: DollarSign, sub: "+12% vs yesterday" },
  { label: "Bookings Today", value: "24", icon: Calendar, sub: "6 walk-ins" },
  { label: "Active Clients", value: "312", icon: Users, sub: "+18 this week" },
  { label: "Avg Wait", value: "18 min", icon: Clock, sub: "↓ 4 min vs last wk" },
];

function Overview() {
  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Live snapshot of your shop, right now.</p>
      </div>

      <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <StaggerItem key={k.label}>
            <div className="bg-card border border-border rounded-xl p-5 hover:border-primary transition-colors">
              <div className="flex items-start justify-between">
                <span className="text-xs text-muted-foreground tracking-wider uppercase">{k.label}</span>
                <k.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="mt-3 text-3xl font-display font-mono">{k.value}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{k.sub}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">Revenue · Last 7 days</h2>
            <span className="text-xs text-muted-foreground">Total: $9,050</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueWeek} margin={{ left: -12, top: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="day" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#16161A", border: "1px solid #27272A", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#FAFAFA" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D4AF37"
                  strokeWidth={2.5}
                  dot={{ fill: "#D4AF37", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg mb-4">Live Queue</h2>
          <div className="space-y-3">
            {barbers.map((b) => {
              const queue = todayQueue.filter((q) => q.barberId === b.id && q.status !== "done");
              const current = queue.find((q) => q.status === "in-service");
              return (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                  <img src={b.avatar} alt="" className="w-9 h-9 rounded-full bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm truncate">{b.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {current ? `Now: ${current.clientName}` : "Idle"}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-primary">{queue.length}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg">Recent Bookings</h2>
          <Link to="/dashboard/queue" className="text-xs text-primary tracking-wider uppercase">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wider">
                <th className="px-5 py-3 font-normal">Client</th>
                <th className="px-5 py-3 font-normal">Barber</th>
                <th className="px-5 py-3 font-normal">Service</th>
                <th className="px-5 py-3 font-normal">Time</th>
                <th className="px-5 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {todayQueue.slice(0, 10).map((q) => {
                const barber = barbers.find((b) => b.id === q.barberId)!;
                const svc = getService(q.serviceId);
                return (
                  <tr key={q.id} className="border-t border-border/60 hover:bg-muted/30 transition">
                    <td className="px-5 py-3 font-display">{q.clientName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{barber.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{svc.name}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{q.time}</td>
                    <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
