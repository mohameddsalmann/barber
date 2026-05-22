import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Check, SkipForward, Coffee, Plus, StickyNote } from "lucide-react";
import { todayQueue, getService, barbers, type Booking } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";
import { StatusBadge } from "@/components/badges";
import { motion } from "framer-motion";
import { useWindowSize } from "@/hooks/use-window-size";

export const Route = createFileRoute("/barber/queue")({
  head: () => ({ meta: [{ title: "My Queue — Barber App" }] }),
  component: BarberQueue,
});

function BarberQueue() {
  const me = barbers[0];
  const [list, setList] = useState<Booking[]>(todayQueue.filter((q) => q.barberId === me.id));
  const [onBreak, setOnBreak] = useState(false);
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  const update = (id: string, status: Booking["status"]) => setList((p) => p.map((q) => q.id === id ? { ...q, status } : q));

  if (isDesktop) {
    return (
      <PageShell>
        <div className="p-6 max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl">My Queue</h1>
              <p className="text-xs text-muted-foreground">{list.filter((q) => q.status !== "done").length} clients ahead</p>
            </div>
            <button className="h-10 px-5 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4" />Add Walk-in
            </button>
          </div>

          {/* Desktop data table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((q, i) => (
                  <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/5 transition">
                    <td className="px-4 py-3 font-display text-primary">{i + 1}</td>
                    <td className="px-4 py-3 font-display">{q.clientName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary">{getService(q.serviceId).name}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{q.time}</td>
                    <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                    <td className="px-4 py-3">
                      {q.status !== "done" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => update(q.id, "in-service")} className="h-7 px-2.5 rounded text-[10px] font-display uppercase tracking-wider bg-primary text-primary-foreground flex items-center gap-1"><Play className="w-3 h-3" />Start</button>
                          <button onClick={() => update(q.id, "done")} className="h-7 px-2.5 rounded text-[10px] font-display uppercase tracking-wider flex items-center gap-1" style={{ backgroundColor: "#16A34A", color: "white" }}><Check className="w-3 h-3" />Done</button>
                          <button onClick={() => update(q.id, "no-show")} className="h-7 px-2.5 rounded text-[10px] font-display uppercase tracking-wider border border-border text-muted-foreground flex items-center gap-1"><SkipForward className="w-3 h-3" />Skip</button>
                          <button className="h-7 w-7 rounded border border-border text-muted-foreground flex items-center justify-center"><StickyNote className="w-3 h-3" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">No clients in queue</div>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // Mobile view
  return (
    <PageShell>
      <div className="px-5 pt-5">
        <h1 className="text-2xl mb-1">My Queue</h1>
        <p className="text-xs text-muted-foreground mb-5">{list.filter((q) => q.status !== "done").length} clients ahead</p>

        <Stagger className="space-y-3">
          {list.map((q, i) => (
            <StaggerItem key={q.id}>
              <motion.div layout className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="font-display text-3xl text-primary w-10 text-center">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base truncate">{q.clientName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary">{getService(q.serviceId).name}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{q.time}</span>
                    </div>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
                {q.status !== "done" && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button onClick={() => update(q.id, "in-service")} className="h-9 rounded-md bg-primary text-primary-foreground font-display text-[11px] uppercase tracking-wider active:scale-[0.97] flex items-center justify-center gap-1"><Play className="w-3 h-3" />Start</button>
                    <button onClick={() => update(q.id, "done")} className="h-9 rounded-md font-display text-[11px] uppercase tracking-wider active:scale-[0.97] flex items-center justify-center gap-1" style={{ backgroundColor: "#16A34A", color: "white" }}><Check className="w-3 h-3" />Done</button>
                    <button onClick={() => update(q.id, "no-show")} className="h-9 rounded-md font-display text-[11px] uppercase tracking-wider border border-border text-muted-foreground active:scale-[0.97] flex items-center justify-center gap-1"><SkipForward className="w-3 h-3" />Skip</button>
                  </div>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOnBreak(!onBreak)}
        className="fixed bottom-24 right-4 max-w-[430px] mx-auto h-12 px-5 rounded-full font-display text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl"
        style={{
          backgroundColor: onBreak ? "#D97706" : "#16161A",
          color: onBreak ? "white" : "#FAFAFA",
          border: "1px solid #27272A",
        }}
      >
        <Coffee className="w-4 h-4" />
        {onBreak ? "On Break" : "I'm on Break"}
      </motion.button>
    </PageShell>
  );
}
