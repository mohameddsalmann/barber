import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Star } from "lucide-react";
import { barbers } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";
import { Pill } from "@/components/badges";

export const Route = createFileRoute("/client/barbers/")({
  head: () => ({ meta: [{ title: "Barbers — Client App" }] }),
  component: BarbersList,
});

const statusPill = (s: string) => {
  if (s === "in") return { label: "Available", color: "#16A34A", bg: "rgba(22,163,74,0.15)" };
  if (s === "break") return { label: "With Client", color: "#D97706", bg: "rgba(217,119,6,0.15)" };
  return { label: "Off Today", color: "#71717A", bg: "rgba(113,113,122,0.15)" };
};

const FILTER_CHIPS = ["All", "Available Now", "Fades", "Beard", "Color", "Classic"] as const;

function BarbersList() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = barbers.filter((b) => {
    const matchesSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Available Now" && b.status === "in") ||
      b.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  return (
    <PageShell>
      <div className="px-5 pt-5">
        <h1 className="text-2xl">Our Barbers</h1>
        <p className="text-xs text-muted-foreground mt-1">Find your perfect barber</p>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty…"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-card border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-1">
          {FILTER_CHIPS.map((chip) => (
            <Pill key={chip} active={activeFilter === chip} onClick={() => setActiveFilter(chip)}>
              {chip}
            </Pill>
          ))}
        </div>

        <Stagger className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((b) => {
            const sp = statusPill(b.status);
            return (
              <StaggerItem key={b.id}>
                <Link to="/client/barbers/$id" params={{ id: b.id }}>
                  <div className="bg-card border border-border rounded-2xl p-4 hover:border-primary transition active:scale-[0.97] h-full flex flex-col">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img src={b.avatar} alt="" className="w-16 h-16 rounded-full" />
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-card"
                          style={{ backgroundColor: sp.color, boxShadow: b.status === "in" ? `0 0 8px ${sp.color}` : undefined }}
                        />
                      </div>
                      <div className="text-center mt-2.5">
                        <div className="font-display text-sm truncate">{b.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{b.specialty}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="font-mono text-xs">{b.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({b.reviewCount})</span>
                    </div>

                    <span
                      className="mt-2 mx-auto px-2 py-0.5 rounded-full text-[10px] font-display tracking-wide"
                      style={{ backgroundColor: sp.bg, color: sp.color }}
                    >
                      {sp.label}
                    </span>

                    <div className="flex flex-wrap gap-1 mt-2.5 justify-center">
                      {b.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(244,63,94,0.12)", color: "#F43F5E" }}>
                          #{t.replace(/\s+/g, "").toLowerCase()}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-primary font-display">View Portfolio →</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No barbers match your search.</div>
        )}
      </div>
    </PageShell>
  );
}
