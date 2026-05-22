import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, ListChecks, DollarSign, User } from "lucide-react";
import { Logo } from "@/components/logo";
import { useWindowSize } from "@/hooks/use-window-size";
import { BarberDesktopLayout } from "@/components/barber/desktop-layout";

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
  { to: "/barber", label: "Today", icon: Home, exact: true },
  { to: "/barber/queue", label: "Queue", icon: ListChecks },
  { to: "/barber/earnings", label: "Earnings", icon: DollarSign },
  { to: "/barber/profile", label: "Profile", icon: User },
];

function BarberMobileLayout() {
  const { pathname } = useLocation();
  return (
    <div className="w-full max-w-[430px] min-h-screen flex flex-col border-x border-border relative">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 h-14 flex items-center">
        <Logo size={28} />
      </header>
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 max-w-[430px] w-full border-t border-border bg-background/95 backdrop-blur grid grid-cols-4">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          return (
            <Link key={t.to} to={t.to} className="flex flex-col items-center justify-center py-3 text-[10px] gap-1" style={{ color: active ? "#D4AF37" : "#A1A1AA" }}>
              <t.icon className="w-5 h-5" />
              <span style={{ fontWeight: active ? 900 : 400 }}>{t.label}</span>
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
