import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { barbers } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/barbers/")({
  head: () => ({ meta: [{ title: "Barbers — Owner Dashboard" }] }),
  component: BarbersList,
});

const statusDot = (s: string) => (s === "in" ? "#16A34A" : s === "break" ? "#D97706" : "#DC2626");
const statusLabel = (s: string) => (s === "in" ? "Clocked in" : s === "break" ? "On break" : "Clocked out");

function BarbersList() {
  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl">Barbers</h1>
        <p className="text-sm text-muted-foreground mt-1">Your team — at a glance.</p>
      </div>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {barbers.map((b) => (
          <StaggerItem key={b.id}>
            <Link to="/dashboard/barbers/$id" params={{ id: b.id }}>
              <motion.div
                whileHover={{ scale: 1.01, borderColor: "#D4AF37" }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.15 }}
                className="bg-card border border-border rounded-xl p-5 cursor-pointer h-full"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img src={b.avatar} alt="" className="w-14 h-14 rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card" style={{ backgroundColor: statusDot(b.status) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base truncate">{b.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{b.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-mono">{b.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {b.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(244,63,94,0.15)", color: "#F43F5E" }}>{t}</span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Today</div>
                    <div className="font-mono text-lg">${b.todayEarnings}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</div>
                    <div className="text-[11px]" style={{ color: statusDot(b.status) }}>{statusLabel(b.status)}</div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </PageShell>
  );
}
