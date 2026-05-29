import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { barbers, logoUrl, getService } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { useI18n, getServiceName } from "@/lib/i18n";
import { formatEGP, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/client/survey/$id")({
  head: () => ({ meta: [{ title: "How was your visit? — Client App" }] }),
  component: Survey,
});

const surveySchema = z.object({
  overallRating: z.number().min(1).max(5),
  haircutQuality: z.enum(["poor", "ok", "excellent"]),
  waitTime: z.enum(["too_long", "just_right", "fast"]),
  cleanliness: z.enum(["below_avg", "good", "spotless"]),
  valueForMoney: z.enum(["pricey", "fair", "great_value"]),
  comment: z.string().optional(),
  wouldReturn: z.enum(["yes", "maybe", "no"]),
});

type SurveyForm = z.infer<typeof surveySchema>;

const getRatingLabels = (t: (k: string) => string): Record<number, string> => ({
  1: t("survey.rating.awful"),
  2: t("survey.rating.poor"),
  3: t("survey.rating.ok"),
  4: t("survey.rating.great"),
  5: t("survey.rating.amazing"),
});

const getCategories = (t: (k: string) => string) => [
  { key: "haircutQuality" as const, label: t("survey.category.haircutQuality"), options: [{ v: "poor", l: t("survey.option.poor") }, { v: "ok", l: t("survey.option.ok") }, { v: "excellent", l: t("survey.option.excellent") }] },
  { key: "waitTime" as const, label: t("survey.category.waitTime"), options: [{ v: "too_long", l: t("survey.option.tooLong") }, { v: "just_right", l: t("survey.option.justRight") }, { v: "fast", l: t("survey.option.fast") }] },
  { key: "cleanliness" as const, label: t("survey.category.cleanliness"), options: [{ v: "below_avg", l: t("survey.option.belowAvg") }, { v: "good", l: t("survey.option.good") }, { v: "spotless", l: t("survey.option.spotless") }] },
  { key: "valueForMoney" as const, label: t("survey.category.valueForMoney"), options: [{ v: "pricey", l: t("survey.option.pricey") }, { v: "fair", l: t("survey.option.fair") }, { v: "great_value", l: t("survey.option.greatValue") }] },
];

function Survey() {
  const barber = barbers[0];
  const { t, locale } = useI18n();
  useEffect(() => { document.title = t("survey.title"); }, [t]);
  const [done, setDone] = useState(false);
  const ratingLabels = getRatingLabels(t);
  const categories = getCategories(t);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { setValue, watch, handleSubmit } = useForm<SurveyForm>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      overallRating: 0,
      haircutQuality: "ok",
      waitTime: "just_right",
      cleanliness: "good",
      valueForMoney: "fair",
      comment: "",
      wouldReturn: "yes",
    },
  });

  const overallRating = watch("overallRating") || 0;
  const wouldReturn = watch("wouldReturn") || "yes";

  const onSubmit = (data: SurveyForm) => {
    console.log("Survey submitted:", data);
    setDone(true);
  };

  useEffect(() => {
    if (!done || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }[] = [];
    const colors = ["#D4AF37", "#F43F5E", "#F5D67A", "#FAFAFA", "#16A34A"];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        life: 1,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.012;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1;
      if (alive) frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [done]);

  return (
    <PageShell>
      <div className="flex justify-center px-5 pt-6">
        <div className="w-full max-w-[440px]">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="text-center">
                  <img src={logoUrl} alt="" className="w-12 h-12 rounded-lg mx-auto" />
                  <h1 className="text-2xl mt-3">{t("survey.title")}</h1>
                </div>

                {/* Barber mini card */}
                <div className="mt-5 bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                  <img src={barber.avatar} alt="" className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="font-display text-sm">{barber.name}</div>
                    <div className="text-[11px] text-muted-foreground">{getServiceName(getService("s2").name, t)} · 35 {t("common.min")} · {formatEGP(35, locale)}</div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Overall Rating */}
                  <h2 className="mt-7 mb-3 text-xs uppercase tracking-wider text-muted-foreground">{t("survey.overallRating")}</h2>
                  <div className="flex items-center justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setValue("overallRating", v)}
                        className="flex-1 flex flex-col items-center gap-1 py-2"
                      >
                        <motion.div animate={{ scale: overallRating >= v ? 1.15 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                          <Star
                            className="w-8 h-8 transition-colors"
                            style={{ fill: overallRating >= v ? "#D4AF37" : "transparent", color: overallRating >= v ? "#D4AF37" : "#52525B" }}
                          />
                        </motion.div>
                        <span className="text-[9px] uppercase tracking-wider" style={{ color: overallRating === v ? "#D4AF37" : "#71717A" }}>
                          {ratingLabels[v]}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Category Ratings */}
                  {categories.map((cat) => (
                    <div key={cat.key} className="mt-5">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{cat.label}</div>
                      <div className="flex gap-2">
                        {cat.options.map((opt) => {
                          const current = watch(cat.key);
                          const active = current === opt.v;
                          return (
                            <button
                              key={opt.v}
                              type="button"
                              onClick={() => setValue(cat.key, opt.v as any)}
                              className="flex-1 h-9 rounded-full text-[11px] font-display tracking-wider border transition"
                              style={{
                                backgroundColor: active ? "rgba(212,175,55,0.15)" : "transparent",
                                borderColor: active ? "#D4AF37" : "#27272A",
                                color: active ? "#D4AF37" : "#A1A1AA",
                              }}
                            >
                              {opt.l}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Text Feedback */}
                  <h2 className="mt-7 mb-2 text-xs uppercase tracking-wider text-muted-foreground">{t("survey.anythingElse")}</h2>
                  <textarea
                    onChange={(e) => setValue("comment", e.target.value)}
                    placeholder={t("survey.commentPlaceholder")}
                    className="w-full h-28 rounded-xl bg-card border border-border p-3 text-sm resize-none focus:outline-none focus:border-primary"
                  />

                  {/* Would Return */}
                  <h2 className="mt-7 mb-2 text-xs uppercase tracking-wider text-muted-foreground">{t("survey.wouldReturn")}</h2>
                  <div className="flex gap-2">
                    {[
                      { v: "yes" as const, l: t("survey.option.yes") },
                      { v: "maybe" as const, l: t("survey.option.maybe") },
                      { v: "no" as const, l: t("survey.option.no") },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setValue("wouldReturn", opt.v)}
                        className="flex-1 h-11 rounded-full font-display text-xs uppercase tracking-wider border transition"
                        style={{
                          backgroundColor: wouldReturn === opt.v ? (opt.v === "yes" ? "rgba(22,163,74,0.15)" : opt.v === "no" ? "rgba(220,38,38,0.15)" : "rgba(212,175,55,0.15)") : "transparent",
                          borderColor: wouldReturn === opt.v ? (opt.v === "yes" ? "#16A34A" : opt.v === "no" ? "#DC2626" : "#D4AF37") : "#27272A",
                          color: wouldReturn === opt.v ? (opt.v === "yes" ? "#16A34A" : opt.v === "no" ? "#DC2626" : "#D4AF37") : "#A1A1AA",
                        }}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={overallRating === 0}
                    className="mt-8 w-full h-12 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
                  >
                    {t("survey.sendFeedback")}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 relative">
                <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 mx-auto flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-2xl mt-5">{t("survey.thankYouName").replace("{name}", "Karim")}</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto">
                  {t("survey.earnedPoints").replace("{points}", formatNumber(50, locale))}
                </p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-primary">
                  <Sparkles className="w-3 h-3" /> {t("survey.loyaltyBoost")}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageShell>
  );
}
