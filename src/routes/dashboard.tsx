import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  Calendar,
  Users,
  UserCircle2,
  BarChart3,
  CreditCard,
  Settings as SettingsIcon,
  Bell,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Owner Dashboard — Adham Gabriil" },
      { name: "description", content: "Run your shop. Live queue, analytics, POS, and team management." },
    ],
  }),
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/queue", label: "Live Queue", icon: ListChecks },
  { to: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { to: "/dashboard/barbers", label: "Barbers", icon: Users },
  { to: "/dashboard/clients", label: "Clients", icon: UserCircle2 },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/pos", label: "POS", icon: CreditCard },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

function DashboardLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border" style={{ backgroundColor: "#0D0D0F" }}>
        <div className="px-5 py-5 border-b border-border">
          <Logo size={36} />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
                style={{
                  backgroundColor: active ? "rgba(212,175,55,0.06)" : "transparent",
                  color: active ? "#FAFAFA" : "#A1A1AA",
                  fontWeight: active ? 900 : 400,
                }}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r"
                    style={{ backgroundColor: "#D4AF37" }}
                  />
                )}
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/40 transition">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-display text-primary">A</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-display truncate">Adham G.</div>
              <div className="text-[11px] text-muted-foreground truncate">Owner · Pro Plan</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 backdrop-blur bg-background/80 border-b border-border h-14 flex items-center px-4 md:px-6 gap-3">
          <div className="md:hidden">
            <Logo size={28} />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:border-primary transition">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary tracking-wider uppercase">Exit</Link>
          </div>
        </header>
        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur grid grid-cols-5">
          {nav.slice(0, 5).map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center py-2 text-[10px] gap-1"
                style={{ color: active ? "#D4AF37" : "#A1A1AA" }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
