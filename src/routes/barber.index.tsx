import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Power, DollarSign, Clock, Star, Users } from "lucide-react";
import { todayQueue, getService, barbers, barberEarningsWeek } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";
import { StatusBadge } from "@/components/badges";
import { useWindowSize } from "@/hooks/use-window-size";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/barber/")({
  head: () => ({ meta: [{ title: "Today — Barber App" }] }),
  component: BarberHome,
});

function BarberHome() {
  const me = barbers[0];
  const [clockedIn, setClockedIn] = useState(true);
  const myQueue = todayQueue.filter((q) => q.barberId === me.id);
  const next = myQueue.find((q) => q.status === "waiting");
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  if (isDesktop) {
    return <DesktopHome me={me} clockedIn={clockedIn} setClockedIn={setClockedIn} myQueue={myQueue} next={next} />;
  }

  return <MobileHome me={me} clockedIn={clockedIn} setClockedIn={setClockedIn} myQueue={myQueue} next={next} />;
}

function MobileHome({ me, clockedIn, setClockedIn, myQueue, next }: any) {
  return (
    <PageShell>
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-muted-foreground">Good morning</div>
            <h1 className="text-xl">{me.name.split(" ")[0]}</h1>
          </div>
          <img src={me.avatar} alt="" className="w-11 h-11 rounded-full" />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setClockedIn(!clockedIn)}
          className="w-full h-14 rounded-xl font-display tracking-widest uppercase text-sm flex items-center justify-center gap-2 transition-colors"
          style={{
            backgroundColor: clockedIn ? "#D4AF37" : "transparent",
            color: clockedIn ? "#09090B" : "#FAFAFA",
            border: clockedIn ? "none" : "1px solid #27272A",
          }}
        >
          <Power className="w-4 h-4" />
          {clockedIn ? "Clocked In" : "Clock In"}
        </motion.button>

        {next && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 bg-card border border-primary/40 rounded-2xl p-4 relative overflow-hidden"
          >
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 0%, rgba(212,175,55,0.12), transparent 60%)" }} />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-display text-primary text-lg">
                {next.clientName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-primary">Next Client</div>
                <div className="font-display text-base mt-0.5 truncate">{next.clientName}</div>
                <div className="text-xs text-muted-foreground">{getService(next.serviceId).name} · {next.time}</div>
              </div>
              <button className="h-10 px-4 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider active:scale-[0.97] flex items-center gap-1.5">
                <Play className="w-3 h-3" />Start
              </button>
            </div>
          </motion.div>
        )}

        <h2 className="mt-6 mb-2 text-sm uppercase tracking-wider text-muted-foreground">Today's Queue</h2>
        <Stagger className="space-y-2">
          {myQueue.map((q: any, i: number) => (
            <StaggerItem key={q.id}>
              <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <div className="font-display text-2xl text-primary w-8 text-center">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm truncate">{q.clientName}</div>
                  <div className="text-[11px] text-muted-foreground">{getService(q.serviceId).name} · {q.time}</div>
                </div>
                <StatusBadge status={q.status} />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="mt-6 mx-5 mb-2 grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Earnings</div>
          <div className="font-mono text-2xl mt-1">$240</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tips</div>
          <div className="font-mono text-2xl mt-1 text-primary">$35</div>
        </div>
      </div>
    </PageShell>
  );
}

function DesktopHome({ me, clockedIn, setClockedIn, myQueue, next }: any) {
  return (
    <PageShell>
      <div className="p-6 max-w-[1200px] mx-auto">
        {/* Top stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <DesktopStat icon={DollarSign} label="Today's Earnings" value={`$${me.todayEarnings}`} />
          <DesktopStat icon={Clock} label="Avg Service Time" value="32 min" />
          <DesktopStat icon={Star} label="Rating" value={me.rating.toString()} accent />
          <DesktopStat icon={Users} label="Today's Cuts" value={me.todayCuts.toString()} />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Upcoming queue */}
          <div>
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Upcoming Queue</h2>
            <div className="space-y-3">
              {myQueue.slice(0, 3).map((q: any, i: number) => (
                <div key={q.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-display text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm">{q.clientName}</div>
                    <div className="text-[11px] text-muted-foreground">{getService(q.serviceId).name} · {q.time}</div>
                  </div>
                  <StatusBadge status={q.status} />
                  {q.status === "waiting" && (
                    <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground font-display text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Play className="w-3 h-3" />Start
                    </button>
                  )}
                </div>
              ))}
              {myQueue.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">No clients in queue</div>}
            </div>
          </div>

          {/* Right: Earnings chart + activity */}
          <div>
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">This Week</h2>
            <div className="bg-card border border-border rounded-2xl p-4 mb-4">
              <div className="h-48">
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

            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Recent Activity</h2>
            <div className="space-y-2">
              {myQueue.filter((q: any) => q.status === "done").slice(0, 3).map((q: any) => (
                <div key={q.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-display text-sm">{q.clientName}</div>
                    <div className="text-[11px] text-muted-foreground">{getService(q.serviceId).name} · Completed</div>
                  </div>
                  <div className="font-mono text-sm text-primary">${getService(q.serviceId).price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function DesktopStat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="font-mono text-2xl" style={{ color: accent ? "#D4AF37" : "#FAFAFA" }}>{value}</div>
    </div>
  );
}
