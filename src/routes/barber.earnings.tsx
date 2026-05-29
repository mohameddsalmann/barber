import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { barberEarningsWeek, barberEarningsMonth, services } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { Pill } from "@/components/badges";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCurrentBarber } from "@/hooks/use-current-barber";
import { useI18n } from "@/lib/i18n";
import { formatEGP } from "@/lib/format";

export const Route = createFileRoute("/barber/earnings")({
  head: () => ({ meta: [{ title: "Earnings — Barber App" }] }),
  component: BarberEarnings,
});

function BarberEarnings() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const me = useCurrentBarber();
  const { t, locale } = useI18n();
  useEffect(() => { document.title = t("route.barber.earningsTitle"); }, [t]);

  const chartData = period === "week" ? barberEarningsWeek : barberEarningsMonth;
  const totalEarned = useMemo(() => chartData.reduce((s, d) => s + d.earned, 0), [chartData]);
  const totalTips = Math.round(totalEarned * 0.11);
  const totalCommission = Math.round(totalEarned * 0.6);
  const avgPerCut = Math.round(totalEarned / (period === "week" ? 22 : 88));

  const serviceBreakdown = [
    { service: t("services.haircut"), count: 8, earned: 1200 },
    { service: t("services.fade"), count: 5, earned: 1000 },
    { service: t("services.beardTrim"), count: 4, earned: 400 },
    { service: t("services.hairBeard"), count: 3, earned: 840 },
    { service: t("services.kidsCut"), count: 2, earned: 160 },
  ];
  // TODO: replace with API call - fetch earnings from backend

  const payouts = period === "week"
    ? [{ d: locale === "ar" ? "٢٢ أبريل" : "Apr 22", amt: 7656 }, { d: locale === "ar" ? "١٥ أبريل" : "Apr 15", amt: 7104 }, { d: locale === "ar" ? "٨ أبريل" : "Apr 08", amt: 8040 }, { d: locale === "ar" ? "١ أبريل" : "Apr 01", amt: 6540 }]
    : [{ d: locale === "ar" ? "مارس ٢٠٢٦" : "Mar 2026", amt: 29340 }, { d: locale === "ar" ? "فبراير ٢٠٢٦" : "Feb 2026", amt: 26880 }, { d: locale === "ar" ? "يناير ٢٠٢٦" : "Jan 2026", amt: 25200 }];

  return (
    <PageShell>
      <div className={isDesktop ? "p-6 max-w-[1200px] mx-auto" : "px-5 pt-5"}>
        <h1 className="text-2xl mb-3">{t("earnings.title")}</h1>
        <div className="flex gap-2 mb-5">
          <Pill active={period === "week"} onClick={() => setPeriod("week")}>{t("earnings.thisWeek")}</Pill>
          <Pill active={period === "month"} onClick={() => setPeriod("month")}>{t("earnings.thisMonth")}</Pill>
        </div>

        <div className={isDesktop ? "grid grid-cols-4 gap-3 mb-5" : "grid grid-cols-3 gap-2 mb-5"}>
          <Card label={t("earnings.earned")} value={formatEGP(totalEarned, locale)} />
          <Card label={t("earnings.tips")} value={formatEGP(totalTips, locale)} accent />
          <Card label={t("earnings.commission")} value={formatEGP(totalCommission, locale)} />
          {isDesktop && <Card label={t("earnings.avgPerCut")} value={formatEGP(avgPerCut, locale)} />}
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 mb-5">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">{t("earnings.dailyBreakdown")}</h2>
          <div className={isDesktop ? "h-64" : "h-48"}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ left: -18, top: 8 }}>
                <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#A1A1AA" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#16161A", border: "1px solid #27272A", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="earned" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-service breakdown table (desktop enhancement) */}
        {isDesktop && (
          <div className="mb-5">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">{t("earnings.perService")}</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 text-left">{t("earnings.service")}</th>
                    <th className="px-4 py-3 text-center">{t("earnings.count")}</th>
                    <th className="px-4 py-3 text-right">{t("earnings.earned")}</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceBreakdown.map((row) => (
                    <tr key={row.service} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-display">{row.service}</td>
                      <td className="px-4 py-3 text-center font-mono">{row.count}</td>
                      <td className="px-4 py-3 text-right font-mono text-primary">{formatEGP(row.earned, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">{t("earnings.recentPayouts")}</h2>
        <div className="space-y-2">
          {payouts.map((p) => (
            <div key={p.d} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-display text-sm">{t("earnings.weeklyPayout")}</div>
                <div className="text-[11px] text-muted-foreground font-mono">{p.d}, 2026</div>
              </div>
              <div className="font-mono text-lg text-primary">{formatEGP(p.amt, locale)}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function Card({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-lg mt-1" style={{ color: accent ? "#D4AF37" : "#FAFAFA" }}>{value}</div>
    </div>
  );
}
