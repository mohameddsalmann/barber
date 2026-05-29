import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Star, SearchX } from "lucide-react";
import { barbers } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/client/barbers/")({
  head: () => ({ meta: [{ title: "Barbers — Client App" }] }),
  component: BarbersList,
});

const statusPill = (s: string, t: (k: string) => string) => {
  if (s === "in") return { label: t("client.barbers.available"), color: "#22863A", bg: "rgba(34,134,58,0.15)" };
  if (s === "break") return { label: t("client.barbers.withClient"), color: "#B45309", bg: "rgba(180,83,9,0.15)" };
  return { label: t("client.barbers.offToday"), color: "#52525B", bg: "rgba(82,82,91,0.15)" };
};

const FILTER_CHIPS = ["All", "Available Now", "Fades", "Beard", "Classic"] as const;

function BarbersList() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const { t, locale } = useI18n();
  useEffect(() => { document.title = t("route.client.barbersTitle"); }, [t]);

  const filtered = barbers.filter((b) => {
    const matchesSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((tg) => tg.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Available Now" && b.status === "in") ||
      b.tags.some((tg) => tg.toLowerCase().includes(activeFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  const isFiltered = search !== "" || activeFilter !== "All";

  return (
    <PageShell>
      <div className="px-5 pt-5">
        <h1 className="text-2xl">{t("client.barbers.title")}</h1>
        <p className="text-xs text-muted-foreground mt-1">{t("client.barbers.subtitle")}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {isFiltered
            ? t("client.barbers.matchingSearch").replace("{count}", String(filtered.length))
            : t("client.barbers.found").replace("{count}", String(barbers.length))}
        </p>

        <div className="relative mt-4">
          <label htmlFor="barber-search" className="sr-only">{t("client.barbers.search")}</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="barber-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("client.barbers.search")}
            className="w-full h-11 pl-9 pr-3 rounded-2xl bg-card border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-1">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={`shrink-0 h-8 px-3 rounded-full text-xs font-display tracking-wide transition active:scale-[0.97] ${activeFilter === chip
                ? "bg-primary text-primary-foreground font-bold"
                : "bg-card border border-border text-muted-foreground"
                }`}
            >
              {chip === "All" ? t("client.barbers.all") : chip === "Available Now" ? t("client.barbers.availableNow") : chip}
            </button>
          ))}
        </div>

        <Stagger className="mt-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((b) => {
            const sp = statusPill(b.status, t);
            const canBook = b.status === "in";
            return (
              <StaggerItem key={b.id}>
                <Link to="/client/barbers/$id" params={{ id: b.id }}>
                  <div className="bg-card border border-border/70 rounded-2xl p-4 hover:border-primary/50 transition active:scale-[0.97] h-full flex flex-col relative">
                    {/* Status badge — top right */}
                    <span
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-display tracking-wide"
                      style={{ backgroundColor: sp.bg, color: sp.color }}
                    >
                      {sp.label}
                    </span>

                    <div className="flex flex-col items-center pt-1">
                      <img src={b.avatar} alt={b.name} className="w-20 h-20 rounded-full" />
                      <div className="text-center mt-3">
                        <div className="font-display text-base font-bold truncate">{b.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{b.specialty}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 mt-2 border-t border-border/40 pt-2">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="font-mono text-xs">{b.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({b.reviewCount})</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                      {b.tags.slice(0, 2).map((tg) => (
                        <span key={tg} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.12)", color: "#C9A84C" }}>
                          #{tg.replace(/\s+/g, "").toLowerCase()}
                        </span>
                      ))}
                    </div>

                    {/* Book Now CTA */}
                    <button
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                      disabled={!canBook}
                      className={`mt-3 w-full h-8 rounded-xl text-xs font-bold transition ${canBook
                        ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                        : "opacity-40 cursor-default"
                        }`}
                    >
                      Book Now
                    </button>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <SearchX className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">{t("client.barbers.noResults")}</p>
            <button
              onClick={() => { setSearch(""); setActiveFilter("All"); }}
              className="mt-3 h-8 px-4 rounded-lg border border-border text-xs font-display tracking-wider uppercase text-muted-foreground hover:text-primary hover:border-primary transition"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
