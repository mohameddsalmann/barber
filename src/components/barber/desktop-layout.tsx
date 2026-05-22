import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, ListChecks, DollarSign, User, Power, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { barbers } from "@/mock/data";

const navItems = [
  { to: "/barber", label: "Today", icon: Home, exact: true },
  { to: "/barber/queue", label: "My Queue", icon: ListChecks },
  { to: "/barber/earnings", label: "Earnings", icon: DollarSign },
  { to: "/barber/profile", label: "Profile", icon: User },
];

export function BarberDesktopLayout() {
  const { pathname } = useLocation();
  const me = barbers[0];

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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition"
                style={{
                  backgroundColor: active ? "rgba(212,175,55,0.1)" : "transparent",
                  color: active ? "#D4AF37" : "#A1A1AA",
                  fontWeight: active ? 900 : 400,
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Status toggle */}
        <div className="px-3 pb-4 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#16A34A", boxShadow: "0 0 8px #16A34A" }} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Clocked In</span>
          </div>
          <button className="w-full h-10 rounded-full font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-primary hover:border-primary transition">
            <Power className="w-3.5 h-3.5" />
            Clock Out
          </button>
          <div className="flex items-center gap-2 px-3 py-2 border-t border-border pt-3">
            <img src={me.avatar} alt="" className="w-8 h-8 rounded-full" />
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
