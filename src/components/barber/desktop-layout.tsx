import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, ListChecks, DollarSign, User, Power, Languages, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { useCurrentBarber } from "@/hooks/use-current-barber";
import { useI18n } from "@/lib/i18n";

const navItems = [
  { to: "/barber", label: "nav.today", icon: Home, exact: true },
  { to: "/barber/queue", label: "nav.queue", icon: ListChecks },
  { to: "/barber/earnings", label: "nav.earnings", icon: DollarSign },
  { to: "/barber/profile", label: "nav.profile", icon: User },
];

export function BarberDesktopLayout() {
  const { pathname } = useLocation();
  const me = useCurrentBarber();
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 border-r border-border flex flex-col h-screen sticky top-0">
        <div className="px-5 h-14 flex items-center border-b border-border">
          <Logo size={28} />
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition"
                style={{
                  backgroundColor: active ? "rgba(212,175,55,0.1)" : "transparent",
                  color: active ? "#D4AF37" : "#A1A1AA",
                  fontWeight: active ? 900 : 400,
                }}
              >
                <item.icon className="w-4 h-4" />
                {t(item.label)}
              </Link>
            );
          })}
        </nav>

        {/* Language toggle */}
        <div className="px-3 pb-2 space-y-2">
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="w-full h-9 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition flex items-center justify-center gap-2 text-xs font-display"
            aria-label={locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
          >
            <Languages className="w-3.5 h-3.5" />
            {locale === "en" ? "ع" : "EN"}
          </button>
          <Link to="/" className="w-full h-9 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition flex items-center justify-center gap-2 text-xs font-display">
            <LogOut className="w-3.5 h-3.5" />
            {t("common.exit")}
          </Link>
        </div>

        {/* Status toggle */}
        <div className="px-3 pb-4 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-success" style={{ boxShadow: "0 0 8px #16A34A" }} aria-label={t("queue.clockedIn")} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("queue.clockedIn")}</span>
          </div>
          <button className="w-full h-10 rounded-full font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-primary hover:border-primary transition" aria-label={t("queue.clockOut")}>
            <Power className="w-3.5 h-3.5" />
            {t("queue.clockOut")}
          </button>
          <div className="flex items-center gap-2 px-3 py-2 border-t border-border pt-3">
            <img src={me.avatar} alt={me.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-display truncate">{me.name}</div>
              <div className="text-[10px] text-muted-foreground">{me.specialty}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
