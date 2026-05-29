import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { barbers, todayQueue, getService, getBarber } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { Pill, StatusBadge } from "@/components/badges";
import { X } from "lucide-react";
import { useI18n, getServiceName } from "@/lib/i18n";
import { formatEGP, formatDate } from "@/lib/format";

export const Route = createFileRoute("/dashboard/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Owner Dashboard" }] }),
  component: CalendarPage,
});

const HOURS = Array.from({ length: 10 }, (_, i) => 9 + i); // 9am..6pm
const COLORS = ["#D4AF37", "#E5C158", "#F5D67A", "#A07E1F"];

function CalendarPage() {
  const { t, locale, dir } = useI18n();
  useEffect(() => { document.title = t("route.dashboard.calendarTitle"); }, [t]);
  const [view, setView] = useState<"day" | "week">("day");
  const [selected, setSelected] = useState<string | null>(null);

  const blocks = todayQueue.map((q, i) => {
    const [h, m] = q.time.split(":").map(Number);
    const top = (h - 9) * 60 + m;
    const svc = getService(q.serviceId);
    const barberIdx = barbers.findIndex((b) => b.id === q.barberId);
    return { ...q, top, height: svc.duration, color: COLORS[barberIdx % COLORS.length], laneIdx: barberIdx, idx: i };
  });

  const sel = blocks.find((b) => b.id === selected);

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl">{t("nav.calendar")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("calendar.pageSubtitle").replace("{date}", formatDate("2026-04-27", locale))}</p>
        </div>
        <div className="flex gap-2">
          <Pill active={view === "day"} onClick={() => setView("day")}>{t("calendar.dayView")}</Pill>
          <Pill active={view === "week"} onClick={() => setView("week")}>{t("calendar.weekView")}</Pill>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 overflow-x-auto">
        <div className="grid" style={{ gridTemplateColumns: `60px repeat(${barbers.length}, minmax(160px, 1fr))` }}>
          <div></div>
          {barbers.map((b, i) => (
            <div key={b.id} className="px-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="font-display text-sm">{b.name}</span>
              </div>
            </div>
          ))}

          <div className="relative">
            {HOURS.map((h) => (
              <div key={h} className="h-[60px] text-[10px] text-muted-foreground text-right pr-2 -mt-2">
                {h}:00
              </div>
            ))}
          </div>

          {barbers.map((b, lane) => (
            <div key={b.id} className="relative border-l border-border" style={{ height: HOURS.length * 60 }}>
              {HOURS.map((h) => (
                <div key={h} className="h-[60px] border-b border-border/40" />
              ))}
              {blocks.filter((bl) => bl.laneIdx === lane).map((bl) => {
                const svc = getService(bl.serviceId);
                return (
                  <button
                    key={bl.id}
                    onClick={() => setSelected(bl.id)}
                    className="absolute left-1 right-1 rounded-md text-left p-2 overflow-hidden hover:scale-[1.01] transition active:scale-[0.99]"
                    style={{
                      top: bl.top,
                      height: bl.height - 2,
                      backgroundColor: `${bl.color}26`,
                      borderLeft: `3px solid ${bl.color}`,
                    }}
                  >
                    <div className="font-display text-[11px] truncate">{bl.clientName}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{getServiceName(svc.name, t)} · {bl.time}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {sel && (
          <motion.aside
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-0 right-0 h-screen w-[380px] bg-card border-l border-border z-40 p-6 overflow-y-auto"
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 rounded-md hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
            <div className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">{t("calendar.bookingDetails")}</div>
            <h2 className="text-2xl mb-4">{sel.clientName}</h2>
            <StatusBadge status={sel.status} />
            <div className="mt-6 space-y-4">
              <Row label={t("common.time")} value={sel.time} />
              <Row label={t("common.service")} value={getServiceName(getService(sel.serviceId).name, t)} />
              <Row label={t("common.barber")} value={getBarber(sel.barberId).name} />
              <Row label={t("common.duration")} value={`${getService(sel.serviceId).duration} ${t("common.min")}`} />
              <Row label={t("common.price")} value={formatEGP(getService(sel.serviceId).price, locale)} />
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 h-10 rounded-md border border-border text-sm">{t("calendar.reschedule")}</button>
              <button className="flex-1 h-10 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider">{t("calendar.checkIn")}</button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-display text-sm">{value}</span>
    </div>
  );
}
