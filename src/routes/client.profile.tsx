import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CreditCard, Smartphone, Landmark } from "lucide-react";
import { barbers, visitHistory, clients } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { TierBadge } from "@/components/badges";
import { useI18n, getServiceName } from "@/lib/i18n";
import { formatEGP, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/client/profile")({
  head: () => ({ meta: [{ title: "My Profile — Client App" }] }),
  component: ClientProfile,
});

function ClientProfile() {
  const me = clients[0]; // Karim
  const { t, locale } = useI18n();
  useEffect(() => { document.title = t("route.client.profileTitle"); }, [t]);
  return (
    <PageShell>
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3">
          <img src={me.avatar} alt={me.name} className="w-16 h-16 rounded-full" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl truncate">{me.name}</h1>
            <div className="text-[11px] text-muted-foreground truncate">{me.email}</div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl p-[1.5px]" style={{ background: "linear-gradient(135deg, #D4AF37, #16161A 60%, #F43F5E)" }}>
          <div className="rounded-2xl bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("client.profile.loyaltyTier")}</div>
                <div className="font-display text-2xl mt-0.5 gold-text">{t("client.profile.vip")}</div>
              </div>
              <TierBadge tier={me.tier} />
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="font-mono text-3xl text-primary">{formatNumber(1240, locale)}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("client.home.points")}</div>
              </div>
              <div className="text-right text-[11px] text-muted-foreground leading-relaxed">{me.visits} {t("client.profile.visits")}<br />{formatEGP(me.ltv, locale)} {t("client.profile.lifetime")}</div>
            </div>
          </div>
        </div>

        <h2 className="mt-6 mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t("client.profile.visitHistory")}</h2>
        <div className="relative ps-5 border-s-2 border-primary/40 space-y-5">
          {visitHistory.map((v, i) => (
            <div key={i} className="relative">
              <span className="absolute -start-[21px] top-1 w-3 h-3 rounded-full bg-primary border-4 border-background" />
              <div className="text-[11px] font-mono text-muted-foreground">{v.date}</div>
              <div className="font-display text-sm mt-0.5">{getServiceName(v.service, t)} · {formatEGP(v.spent, locale)}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{t("client.profile.with")} {v.barber}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-6 mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t("client.profile.favoriteBarbers")}</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-5 px-5 pb-2">
          {barbers.map((b) => (
            <div key={b.id} className="shrink-0 w-32 bg-card border border-border rounded-xl p-3 text-center">
              <img src={b.avatar} alt={b.name} className="w-14 h-14 rounded-full mx-auto" />
              <div className="font-display text-xs mt-2 truncate">{b.name}</div>
              <div className="text-[10px] text-muted-foreground">{b.specialty}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-6 mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t("client.profile.payment")}</h2>
        <div className="space-y-2">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-display text-sm">Visa ending 4242</div>
              <div className="text-[11px] text-muted-foreground font-mono">Expires 09/28</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>{t("client.profile.default")}</span>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><Smartphone className="w-5 h-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-display text-sm">Vodafone Cash</div>
              <div className="text-[11px] text-muted-foreground font-mono">+20 100 ***0142</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><Landmark className="w-5 h-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-display text-sm">InstaPay</div>
              <div className="text-[11px] text-muted-foreground font-mono">karim@instapay</div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
