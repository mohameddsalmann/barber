import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, MessageSquareHeart } from "lucide-react";
import { barbers } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";

export const Route = createFileRoute("/client/queue/$id")({
  head: () => ({ meta: [{ title: "Live Queue — Client App" }] }),
  component: QueueTracker,
});

const getSteps = (t: (k: string) => string) => [t("client.queue.steps.waiting"), t("client.queue.steps.almostReady"), t("client.queue.steps.inChair"), t("client.queue.steps.done")];

function QueueTracker() {
  const { id } = Route.useParams();
  const barber = barbers[0];
  const { t, locale } = useI18n();
  useEffect(() => { document.title = t("route.client.barbersTitle"); }, [t]);
  const [completed, setCompleted] = useState(false);
  const position = 3;
  const currentStep = 0;
  const steps = getSteps(t);

  if (completed) return <CompleteScreen id={id} />;

  return (
    <PageShell>
      <div className="px-5 pt-8 text-center">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("client.queue.yourPosition")}</div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="mt-3">
          <div className="text-sm text-muted-foreground">{t("client.queue.youAre")}</div>
          <div className="font-display text-6xl text-primary leading-none mt-1">#{formatNumber(position, locale)}</div>
        </motion.div>
        <div className="mt-3 text-sm text-muted-foreground">{t("client.queue.estWait").replace("{minutes}", formatNumber(18, locale))}</div>

        <div className="mt-6 mx-auto max-w-xs">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "32%" }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full" style={{ background: "linear-gradient(90deg, #D4AF37, #F5D67A)" }} />
          </div>
        </div>
      </div>

      <div className="mx-5 mt-8 bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
        <div className="relative">
          <img src={barber.avatar} alt="" className="w-12 h-12 rounded-full" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card" style={{ backgroundColor: "#16A34A", boxShadow: "0 0 6px #16A34A" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("client.queue.yourBarber")}</div>
          <div className="font-display text-base">{barber.name}</div>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono"><Star className="w-3 h-3 fill-primary text-primary" />{barber.rating}</div>
      </div>

      <div className="mx-5 mt-6">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((s, i) => {
            const active = i === currentStep;
            const past = i < currentStep;
            return (
              <div key={s} className="text-center">
                <div className="relative h-1 rounded-full mb-2" style={{ backgroundColor: i <= currentStep ? "#D4AF37" : "#27272A" }} />
                <div className={`mx-auto w-3 h-3 rounded-full ${active ? "pulse-gold" : ""}`} style={{ backgroundColor: i <= currentStep ? "#D4AF37" : "#27272A" }} />
                <div className="text-[10px] mt-2" style={{ color: active ? "#D4AF37" : past ? "#FAFAFA" : "#A1A1AA", fontWeight: active ? 900 : 400 }}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-5 mt-8 space-y-2">
        <button onClick={() => setCompleted(true)} className="w-full h-11 rounded-md border border-primary/40 text-primary text-[11px] font-display uppercase tracking-wider hover:bg-primary/5">
          {t("client.queue.demoComplete")}
        </button>
        <Link to="/client" className="block text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-primary py-2">{t("client.queue.cancelBooking")}</Link>
      </div>
    </PageShell>
  );
}

function CompleteScreen({ id }: { id: string }) {
  const { t, locale } = useI18n();
  return (
    <PageShell>
      <AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5 pt-12 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 mx-auto flex items-center justify-center">
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-3xl mt-5 leading-tight">{t("client.queue.visitComplete")}</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto">{t("client.queue.hopeYouLove")}</p>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 mx-auto max-w-[330px] bg-card border border-primary/40 rounded-2xl p-4 text-left relative overflow-hidden">
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(212,175,55,0.15), transparent 60%)" }} />
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0"><MessageSquareHeart className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] uppercase tracking-widest text-primary">{t("client.queue.newMessage").replace("{name}", "Adham Gabriil")}</div>
                <div className="font-display text-sm mt-1">{t("client.queue.howWasExp")}</div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{t("client.queue.surveyDesc").replace("{points}", formatNumber(50, locale))}</div>
                <Link to="/client/survey/$id" params={{ id }}>
                  <button className="mt-3 h-9 px-4 rounded-md bg-primary text-primary-foreground text-[10px] font-display uppercase tracking-wider active:scale-[0.97]">{t("client.queue.takeSurvey")}</button>
                </Link>
              </div>
            </div>
          </motion.div>

          <Link to="/client" className="inline-block mt-8 text-xs text-muted-foreground underline underline-offset-4 hover:text-primary">{t("client.queue.backToHome")}</Link>
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}
