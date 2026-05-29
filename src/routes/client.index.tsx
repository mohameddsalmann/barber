import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Calendar, Clock, Sparkles, MapPin, Users } from "lucide-react";
import { barbers, nearbyShops } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";
import { formatEGP, formatWaitMin, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/client/")({
  head: () => ({ meta: [{ title: "Home — Client App" }] }),
  component: ClientHome,
});

const dot = (s: string) => (s === "in" ? "#16A34A" : s === "break" ? "#D97706" : "#71717A");

function ClientHome() {
  const fav = barbers[0];
  const online = barbers.filter((b) => b.status === "in" || b.status === "break");
  const { t, locale } = useI18n();
  useEffect(() => { document.title = t("route.client.homeTitle"); }, [t]);
  return (
    <PageShell>
      <div className="px-5 pt-5">
        <div className="text-xs text-muted-foreground">{t("client.home.title")}</div>
        <h1 className="text-2xl mt-0.5">{t("client.home.title")}</h1>

        <Link to="/client/barbers">
          <div className="mt-5 bg-card border border-primary/40 rounded-2xl p-4 relative overflow-hidden">
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(212,175,55,0.18), transparent 60%)" }} />
            <div className="relative flex items-center gap-3">
              <img src={fav.avatar} alt={fav.name} className="w-12 h-12 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-primary">{t("client.home.favoriteBarber")}</div>
                <div className="font-display text-base mt-0.5 truncate">{fav.name.split(" ")[0]} · {fav.specialty}</div>
                <div className="text-[11px] text-muted-foreground">Adham Gabriil — Downtown</div>
              </div>
              <div className="font-display text-xs text-primary tracking-wider uppercase">{t("client.home.view")} →</div>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Quick to="/client/barbers" icon={Users} label={t("nav.barbers")} />
          <Quick to="/client/style-studio" icon={Sparkles} label={t("nav.styleStudio")} />
        </div>

        <div className="mt-6 flex items-center justify-between mb-3">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">{t("client.home.availableNow")}</h2>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-success" style={{ boxShadow: "0 0 8px #16A34A" }} aria-hidden />
            <span>{online.filter((b) => b.status === "in").length} {t("client.home.live")}</span>
          </div>
        </div>
        <Stagger className="flex gap-3 overflow-x-auto scrollbar-none -mx-5 px-5 pb-2">
          {barbers.map((b) => (
            <StaggerItem key={b.id}>
              <Link to="/client/barbers/$id" params={{ id: b.id }}>
                <div className="w-32 bg-card border border-border rounded-2xl p-3 hover:border-primary transition active:scale-[0.97]">
                  <div className="relative w-fit mx-auto">
                    <img src={b.avatar} alt={b.name} className="w-16 h-16 rounded-full" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-card" style={{ backgroundColor: dot(b.status), boxShadow: b.status === "in" ? "0 0 8px #16A34A" : undefined }} aria-label={b.status === "in" ? t("status.online") : b.status === "break" ? t("status.break") : t("status.offline")} />
                  </div>
                  <div className="text-center mt-2">
                    <div className="font-display text-xs truncate">{b.name.split(" ")[0]}</div>
                    <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: dot(b.status) }}>
                      {b.status === "in" ? t("status.online") : b.status === "break" ? t("status.break") : t("status.offline")}
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-5 bg-card border border-border rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("client.home.loyalty")}</div>
              <div className="font-display text-xl mt-0.5">{t("client.home.goldTier")}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl text-primary">{formatNumber(1240, locale)}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("client.home.points")}</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "62%", background: "linear-gradient(90deg, #D4AF37, #F5D67A)" }} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-1.5">{formatNumber(760, locale)} {t("client.home.toVip")}</div>
          </div>
        </div>

        <h2 className="mt-6 mb-2 text-sm uppercase tracking-wider text-muted-foreground">{t("client.home.nearbyShops")}</h2>
        <Stagger className="space-y-2">
          {nearbyShops.map((s) => (
            <StaggerItem key={s.id}>
              <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm truncate">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">{s.distance}</div>
                </div>
                <span className="px-2 py-1 rounded-full text-[10px] font-display tracking-wide" style={{ backgroundColor: s.waitMin > 15 ? "rgba(217,119,6,0.15)" : "rgba(22,163,74,0.15)", color: s.waitMin > 15 ? "#D97706" : "#16A34A" }}>{formatWaitMin(s.waitMin, locale)} {t("client.home.wait")}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </PageShell>
  );
}

function Quick({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to}>
      <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1 hover:border-primary transition active:scale-[0.97] min-h-[44px] justify-center">
        <Icon className="w-5 h-5 text-primary" />
        <div className="font-display text-[11px]">{label}</div>
      </div>
    </Link>
  );
}
