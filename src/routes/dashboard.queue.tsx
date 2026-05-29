import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, Check, Clock } from "lucide-react";
import { barbers, services, todayQueue as initialQueue, getService, type Booking } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { StatusBadge } from "@/components/badges";
import { formatEGP } from "@/lib/format";
import { useI18n, getServiceName } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard/queue")({
  head: () => ({ meta: [{ title: "Live Queue — Owner Dashboard" }] }),
  component: QueuePage,
});

function QueueCard({ booking, onStart, onDone }: { booking: Booking; onStart: () => void; onDone: () => void }) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: booking.id });
  const svc = getService(booking.serviceId);
  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      layout
      animate={{ opacity: isDragging ? 0.4 : 1 }}
      className="bg-muted/40 border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-display text-sm leading-tight">{booking.clientName}</div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{getServiceName(svc.name, t)}</span>
        <span className="font-mono">{booking.time}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.waitMin}m</span>
      </div>
      <div className="flex gap-2" onPointerDown={(e) => e.stopPropagation()}>
        {booking.status === "waiting" && (
          <button
            onClick={onStart}
            className="flex-1 h-7 rounded-md bg-primary text-primary-foreground font-display text-[11px] tracking-wider uppercase active:scale-[0.97] transition flex items-center justify-center gap-1"
          >
            <Play className="w-3 h-3" /> {t("queue.start")}
          </button>
        )}
        {booking.status === "in-service" && (
          <button
            onClick={onDone}
            className="flex-1 h-7 rounded-md font-display text-[11px] tracking-wider uppercase active:scale-[0.97] transition flex items-center justify-center gap-1"
            style={{ backgroundColor: "#16A34A", color: "white" }}
          >
            <Check className="w-3 h-3" /> {t("queue.done")}
          </button>
        )}
        {booking.status === "done" && (
          <div className="flex-1 h-7 rounded-md border border-border text-[11px] text-muted-foreground flex items-center justify-center">
            {t("today.completed")}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Column({ barberId, children, count }: { barberId: string; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: barberId });
  const barber = barbers.find((b) => b.id === barberId)!;
  return (
    <div
      ref={setNodeRef}
      className="bg-card border rounded-xl p-3 min-h-[400px] transition-colors"
      style={{ borderColor: isOver ? "#D4AF37" : "#27272A" }}
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
        <img src={barber.avatar} alt="" className="w-8 h-8 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm truncate">{barber.name}</div>
          <div className="text-[10px] text-muted-foreground truncate">{barber.specialty}</div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-mono">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function QueuePage() {
  const { t, locale, dir } = useI18n();
  useEffect(() => { document.title = t("route.dashboard.queueTitle"); }, [t]);
  const [queue, setQueue] = useState<Booking[]>(initialQueue);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [walkIn, setWalkIn] = useState({ name: "", serviceId: services[0].id, barberId: barbers[0].id });

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const dragging = useMemo(() => queue.find((q) => q.id === draggingId) || null, [queue, draggingId]);

  const handleDragStart = (e: DragStartEvent) => setDraggingId(String(e.active.id));
  const handleDragEnd = (e: DragEndEvent) => {
    setDraggingId(null);
    if (!e.over) return;
    const newBarberId = String(e.over.id);
    setQueue((prev) => prev.map((q) => (q.id === e.active.id ? { ...q, barberId: newBarberId } : q)));
  };

  const update = (id: string, status: Booking["status"]) =>
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));

  const addWalkIn = () => {
    if (!walkIn.name.trim()) return;
    const id = `w${Date.now()}`;
    setQueue((prev) => [
      ...prev,
      {
        id,
        clientName: walkIn.name,
        barberId: walkIn.barberId,
        serviceId: walkIn.serviceId,
        time: now.toTimeString().slice(0, 5),
        status: "waiting",
        waitMin: 0,
      },
    ]);
    setWalkIn({ name: "", serviceId: services[0].id, barberId: barbers[0].id });
    setWalkInOpen(false);
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl">{t("nav.liveQueue")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("queue.pageSubtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono text-xl">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
            <div className="text-[10px] text-muted-foreground tracking-wider uppercase">{t("common.live")}</div>
          </div>
          <button
            onClick={() => setWalkInOpen(true)}
            className="h-10 px-4 rounded-md bg-primary text-primary-foreground font-display text-xs tracking-wider uppercase active:scale-[0.97] transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {t("queue.addWalkin")}
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {barbers.map((b) => {
            const items = queue.filter((q) => q.barberId === b.id);
            return (
              <Column key={b.id} barberId={b.id} count={items.filter((q) => q.status !== "done").length}>
                <AnimatePresence>
                  {items.map((q) => (
                    <QueueCard
                      key={q.id}
                      booking={q}
                      onStart={() => update(q.id, "in-service")}
                      onDone={() => update(q.id, "done")}
                    />
                  ))}
                </AnimatePresence>
              </Column>
            );
          })}
        </div>
        <DragOverlay>{dragging ? <div className="bg-card border border-primary rounded-lg p-3 w-64"><div className="font-display text-sm">{dragging.clientName}</div></div> : null}</DragOverlay>
      </DndContext>

      <AnimatePresence>
        {walkInOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setWalkInOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl mb-4">{t("queue.addWalkin")}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground">{t("common.clientName")}</label>
                  <input
                    autoFocus
                    value={walkIn.name}
                    onChange={(e) => setWalkIn({ ...walkIn, name: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm transition"
                    placeholder={t("common.fullName")}
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground">{t("common.service")}</label>
                  <select
                    value={walkIn.serviceId}
                    onChange={(e) => setWalkIn({ ...walkIn, serviceId: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm"
                  >
                    {services.map((s) => <option key={s.id} value={s.id}>{getServiceName(s.name, t)} — {formatEGP(s.price, locale)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground">{t("common.barber")}</label>
                  <select
                    value={walkIn.barberId}
                    onChange={(e) => setWalkIn({ ...walkIn, barberId: e.target.value })}
                    className="mt-1 w-full h-10 px-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm"
                  >
                    {barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setWalkInOpen(false)} className="flex-1 h-10 rounded-md border border-border text-sm">{t("common.cancel")}</button>
                <button onClick={addWalkIn} className="flex-1 h-10 rounded-md bg-primary text-primary-foreground font-display text-xs tracking-wider uppercase active:scale-[0.97]">{t("queue.addToQueue")}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
