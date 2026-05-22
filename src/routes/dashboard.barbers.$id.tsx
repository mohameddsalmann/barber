import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { barbers, barberEarningsWeek, reviews } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { Pill, StatusBadge } from "@/components/badges";

export const Route = createFileRoute("/dashboard/barbers/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${barbers.find((b) => b.id === params.id)?.name ?? "Barber"} — Profile` }],
  }),
  component: BarberProfile,
  notFoundComponent: () => <div className="p-6">Barber not found.</div>,
  loader: ({ params }) => {
    const b = barbers.find((x) => x.id === params.id);
    if (!b) throw notFound();
    return b;
  },
});

const TABS = ["Schedule", "Attendance", "Earnings", "Reviews"] as const;
type Tab = typeof TABS[number];

function BarberProfile() {
  const b = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("Schedule");

  return (
    <PageShell>
      <Link to="/dashboard/barbers" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-3 h-3" /> Back to barbers
      </Link>

      <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-5 flex-wrap">
        <img src={b.avatar} alt="" className="w-[60px] h-[60px] rounded-full" />
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl truncate">{b.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{b.bio}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {b.tags.map((t: string) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(244,63,94,0.15)", color: "#F43F5E" }}>{t}</span>
            ))}
            <span className="flex items-center gap-1 ml-2 text-xs font-mono"><Star className="w-3 h-3 fill-primary text-primary" />{b.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Today's Earnings</div>
          <div className="font-mono text-3xl">${b.todayEarnings}</div>
        </div>
      </div>

      <div className="flex gap-2 mt-6 mb-4 flex-wrap">
        {TABS.map((t) => <Pill key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Pill>)}
      </div>

      {tab === "Schedule" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg mb-4">Weekly Schedule</h2>
          <div className="grid grid-cols-7 gap-2">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
              <div key={d}>
                <div className="text-[10px] text-center uppercase tracking-wider text-muted-foreground mb-2">{d}</div>
                <div className="space-y-1">
                  {i < 6 ? (
                    <div className="rounded-md p-2 text-center" style={{ backgroundColor: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>
                      <div className="font-mono text-[11px]">9:00</div>
                      <div className="font-mono text-[10px] text-muted-foreground">17:00</div>
                    </div>
                  ) : <div className="rounded-md p-2 text-center text-[10px] text-muted-foreground border border-dashed border-border">Off</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Attendance" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3 text-left font-normal">Date</th><th className="px-5 py-3 text-left font-normal">Clock In</th><th className="px-5 py-3 text-left font-normal">Clock Out</th><th className="px-5 py-3 text-left font-normal">Hours</th><th className="px-5 py-3 text-left font-normal">Status</th></tr>
            </thead>
            <tbody>
              {[
                { d: "Apr 27", in: "08:55", out: "—", h: "—", s: "in-service" as const },
                { d: "Apr 26", in: "09:02", out: "17:14", h: "8.2", s: "done" as const },
                { d: "Apr 25", in: "08:48", out: "17:30", h: "8.7", s: "done" as const },
                { d: "Apr 24", in: "—", out: "—", h: "0", s: "no-show" as const },
                { d: "Apr 23", in: "09:15", out: "17:00", h: "7.75", s: "done" as const },
              ].map((r) => (
                <tr key={r.d} className="border-t border-border/60">
                  <td className="px-5 py-3 font-display">{r.d}</td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">{r.in}</td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">{r.out}</td>
                  <td className="px-5 py-3 font-mono">{r.h}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.s} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Earnings" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg mb-4">Daily Earnings</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barberEarningsWeek} margin={{ left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                  <XAxis dataKey="day" stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#16161A", border: "1px solid #27272A", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="earned" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Tips this week</div>
              <div className="font-mono text-3xl mt-2">$184</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Commission (60%)</div>
              <div className="font-mono text-3xl mt-2">$1,092</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Total payout</div>
              <div className="font-mono text-3xl mt-2 text-primary">$1,276</div>
            </div>
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-sm">{r.client}</div>
                <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}</div>
              </div>
              <p className="text-sm text-muted-foreground">{r.comment}</p>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-3">{r.date}</div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
