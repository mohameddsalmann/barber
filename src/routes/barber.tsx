import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Home, ListChecks, DollarSign, User, Languages, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { useWindowSize } from "@/hooks/use-window-size";
import { BarberDesktopLayout } from "@/components/barber/desktop-layout";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/barber")({
  head: () => ({
    meta: [
      { title: "Barber App — Adham Gabriil" },
      { name: "description", content: "Your day, your chair, your earnings — at a glance." },
    ],
  }),
  component: BarberLayout,
});

const tabs = [
  { to: "/barber", label: "nav.today", icon: Home, exact: true },
  { to: "/barber/queue", label: "nav.queue", icon: ListChecks },
  { to: "/barber/earnings", label: "nav.earnings", icon: DollarSign },
  { to: "/barber/profile", label: "nav.profile", icon: User },
];

function BarberMobileLayout() {
  const { pathname } = useLocation();
  const { t, locale, setLocale, dir } = useI18n();
  useEffect(() => {
    document.title = t("route.barber.todayTitle");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("barber.metaDescription"));
  }, [t]);
  return (
    <div className="w-full max-w-[430px] min-h-screen flex flex-col border-x border-border relative" dir={dir}>
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 h-14 flex items-center justify-between">
        <Logo size={28} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="h-8 px-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition flex items-center gap-1.5 text-xs font-display"
            aria-label={locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
          >
            <Languages className="w-3.5 h-3.5" />
            {locale === "en" ? "ع" : "EN"}
          </button>
          <Link to="/" className="h-8 px-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition flex items-center gap-1.5 text-xs font-display">
            <LogOut className="w-3.5 h-3.5" />
            {t("common.exit")}
          </Link>
        </div>
      </header>
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 max-w-[430px] w-full border-t border-border bg-background/95 backdrop-blur grid grid-cols-4">
        {tabs.map((tab) => {
          const active = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
          return (
            <Link key={tab.to} to={tab.to} aria-current={active ? "page" : undefined} className="flex flex-col items-center justify-center py-3 text-[10px] gap-1 min-h-[56px]" style={{ color: active ? "#D4AF37" : "#A1A1AA" }}>
              <tab.icon className="w-5 h-5" />
              <span className={active ? "font-black" : "font-normal"}>{t(tab.label)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function BarberLayout() {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  if (isDesktop) {
    return <BarberDesktopLayout />;
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <BarberMobileLayout />
    </div>
  );
}
