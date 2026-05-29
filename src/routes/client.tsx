import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Home, Users, Sparkles, User, Languages, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/client")({
  head: () => ({
    meta: [
      { title: "Client App — Adham Gabriil" },
      { name: "description", content: "Style Studio & Barber Discovery — find your best look and your perfect barber." },
    ],
  }),
  component: ClientLayout,
});

const tabs = [
  { to: "/client", label: "nav.home", icon: Home, exact: true },
  { to: "/client/barbers", label: "nav.barbers", icon: Users, match: "/client/barbers" },
  { to: "/client/style-studio", label: "nav.styleStudio", icon: Sparkles },
  { to: "/client/profile", label: "nav.profile", icon: User },
];

function ClientLayout() {
  const { pathname } = useLocation();
  const { t, locale, setLocale, dir } = useI18n();
  useEffect(() => {
    document.title = t("route.client.homeTitle");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("client.metaDescription"));
  }, [t]);
  return (
    <div className="min-h-screen bg-background flex justify-center" dir={dir}>
      <div className="w-full max-w-[430px] min-h-screen flex flex-col border-x border-border relative">
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
            const match = tab.match ?? tab.to;
            const active = tab.exact ? pathname === tab.to : pathname.startsWith(match);
            return (
              <Link
                key={tab.label}
                to={tab.to}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center justify-center py-3 text-xs gap-1 min-h-[64px] border-t-2 transition-colors"
                style={{
                  borderColor: active ? "#C9A84C" : "transparent",
                  color: active ? "#C9A84C" : "#A1A1AA",
                }}
              >
                <tab.icon className="w-6 h-6" />
                <span className={active ? "font-black" : "font-normal"}>{t(tab.label)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
