import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, Users, Sparkles, User } from "lucide-react";
import { Logo } from "@/components/logo";

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
  { to: "/client", label: "Home", icon: Home, exact: true },
  { to: "/client/barbers", label: "Barbers", icon: Users, match: "/client/barbers" },
  { to: "/client/style-studio", label: "Style Studio", icon: Sparkles },
  { to: "/client/profile", label: "Profile", icon: User },
];

function ClientLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col border-x border-border relative">
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 h-14 flex items-center">
          <Logo size={28} />
        </header>
        <main className="flex-1 pb-24">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 max-w-[430px] w-full border-t border-border bg-background/95 backdrop-blur grid grid-cols-4">
          {tabs.map((t) => {
            const match = t.match ?? t.to;
            const active = t.exact ? pathname === t.to : pathname.startsWith(match);
            return (
              <Link key={t.label} to={t.to} className="flex flex-col items-center justify-center py-3 text-[10px] gap-1" style={{ color: active ? "#D4AF37" : "#A1A1AA" }}>
                <t.icon className="w-5 h-5" />
                <span style={{ fontWeight: active ? 900 : 400 }}>{t.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
