import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Play, Check, SkipForward, Coffee, Plus, StickyNote } from "lucide-react";
import { todayQueue, getService, type Booking } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";
import { StatusBadge } from "@/components/badges";
import { motion } from "framer-motion";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCurrentBarber } from "@/hooks/use-current-barber";
import { useI18n, getServiceName } from "@/lib/i18n";
import { formatEGP } from "@/lib/format";

export const Route = createFileRoute("/barber/queue")({
  head: () => ({ meta: [{ title: "My Queue — Barber App" }] }),
  component: BarberQueue,
});

function BarberQueue() {
  const me = useCurrentBarber();
  const { t, locale } = useI18n();
  useEffect(() => { document.title = t("route.barber.queueTitle"); }, [t]);
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
              <h1 className="text-2xl">{t("queue.title")}</h1>
              <p className="text-xs text-muted-foreground">{list.filter((q) => q.status !== "done").length} {t("queue.clientsAhead")}</p>
            </div>
            <button className="h-10 px-5 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider flex items-center gap-2" aria-label={t("queue.addWalkin")}>
              <Plus className="w-4 h-4" />{t("queue.addWalkin")}
            </button>
          </div>

          {/* Desktop data table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">{t("common.client")}</th>
                  <th className="px-4 py-3 text-left">{t("common.service")}</th>
                  <th className="px-4 py-3 text-left">{t("common.time")}</th>
                  <th className="px-4 py-3 text-left">{t("common.status")}</th>
                  <th className="px-4 py-3 text-right">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((q, i) => (
                  <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/5 transition">
                    <td className="px-4 py-3 font-display text-primary">{i + 1}</td>
                    <td className="px-4 py-3 font-display">{q.clientName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary">{getServiceName(getService(q.serviceId).name, t)}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{q.time}</td>
                    <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                    <td className="px-4 py-3">
                      {q.status !== "done" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => update(q.id, "in-service")} className="h-8 px-3 rounded text-[10px] font-display uppercase tracking-wider bg-primary text-primary-foreground flex items-center gap-1" aria-label={`${t("queue.start")} ${q.clientName}`}><Play className="w-3 h-3" />{t("queue.start")}</button>
                          <button onClick={() => update(q.id, "done")} className="h-8 px-3 rounded text-[10px] font-display uppercase tracking-wider flex items-center gap-1 bg-success text-white" aria-label={`${t("queue.done")} ${q.clientName}`}><Check className="w-3 h-3" />{t("queue.done")}</button>
                          <button onClick={() => update(q.id, "no-show")} className="h-8 px-3 rounded text-[10px] font-display uppercase tracking-wider border border-border text-muted-foreground flex items-center gap-1" aria-label={`${t("queue.skip")} ${q.clientName}`}><SkipForward className="w-3 h-3" />{t("queue.skip")}</button>
                          <button className="h-8 w-8 rounded border border-border text-muted-foreground flex items-center justify-center" aria-label={t("common.notes")}><StickyNote className="w-3 h-3" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">{t("queue.noClients")}</div>
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
        <h1 className="text-2xl mb-1">{t("queue.title")}</h1>
        <p className="text-xs text-muted-foreground mb-5">{list.filter((q) => q.status !== "done").length} {t("queue.clientsAhead")}</p>

        <Stagger className="space-y-3">
          {list.map((q, i) => (
            <StaggerItem key={q.id}>
              <motion.div layout className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="font-display text-3xl text-primary w-10 text-center">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base truncate">{q.clientName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary">{getServiceName(getService(q.serviceId).name, t)}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{q.time}</span>
                    </div>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
                {q.status !== "done" && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button onClick={() => update(q.id, "in-service")} className="h-11 rounded-md bg-primary text-primary-foreground font-display text-[11px] uppercase tracking-wider active:scale-[0.97] flex items-center justify-center gap-1" aria-label={`${t("queue.start")} ${q.clientName}`}><Play className="w-3 h-3" />{t("queue.start")}</button>
                    <button onClick={() => update(q.id, "done")} className="h-11 rounded-md font-display text-[11px] uppercase tracking-wider active:scale-[0.97] flex items-center justify-center gap-1 bg-success text-white" aria-label={`${t("queue.done")} ${q.clientName}`}><Check className="w-3 h-3" />{t("queue.done")}</button>
                    <button onClick={() => update(q.id, "no-show")} className="h-11 rounded-md font-display text-[11px] uppercase tracking-wider border border-border text-muted-foreground active:scale-[0.97] flex items-center justify-center gap-1" aria-label={`${t("queue.skip")} ${q.clientName}`}><SkipForward className="w-3 h-3" />{t("queue.skip")}</button>
                  </div>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Fixed break button - anchored within the client app frame */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pointer-events-none">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setOnBreak(!onBreak)}
          className="w-full h-12 rounded-full font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl pointer-events-auto"
          style={{
            backgroundColor: onBreak ? "#D97706" : "#16161A",
            color: onBreak ? "white" : "#FAFAFA",
            border: "1px solid #27272A",
          }}
          aria-label={onBreak ? t("queue.onBreak") : t("queue.breakBtn")}
        >
          <Coffee className="w-4 h-4" />
          {onBreak ? t("queue.onBreak") : t("queue.breakBtn")}
        </motion.button>
      </div>
    </PageShell>
  );
}
