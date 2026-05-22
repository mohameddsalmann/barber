import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { clients } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { Pill, TierBadge } from "@/components/badges";

export const Route = createFileRoute("/dashboard/clients/")({
  head: () => ({ meta: [{ title: "Clients — Owner Dashboard" }] }),
  component: ClientsList,
});

const FILTERS = ["All", "VIP", "Dormant", "New"] as const;
type Filter = typeof FILTERS[number];

function ClientsList() {
  const [filter, setFilter] = useState<Filter>("All");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    return clients.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === "VIP") return c.tier === "vip";
      if (filter === "New") return c.visits <= 3;
      if (filter === "Dormant") return new Date(c.lastVisit) < new Date("2026-04-01");
      return true;
    });
  }, [filter, q]);

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl">Clients</h1>
        <p className="text-sm text-muted-foreground mt-1">Your CRM, dialed in.</p>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients..."
            className="h-10 pl-9 pr-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm w-72"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-normal">Client</th>
              <th className="px-5 py-3 text-left font-normal">Visits</th>
              <th className="px-5 py-3 text-left font-normal">Lifetime Value</th>
              <th className="px-5 py-3 text-left font-normal">Last Visit</th>
              <th className="px-5 py-3 text-left font-normal">Tier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-border/60 hover:bg-muted/30 transition cursor-pointer">
                <td className="px-5 py-3">
                  <Link to="/dashboard/clients/$id" params={{ id: c.id }} className="flex items-center gap-3">
                    <img src={c.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-display">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground">{c.email}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3 font-mono">{c.visits}</td>
                <td className="px-5 py-3 font-mono text-primary">${c.ltv.toLocaleString()}</td>
                <td className="px-5 py-3 font-mono text-muted-foreground">{c.lastVisit}</td>
                <td className="px-5 py-3"><TierBadge tier={c.tier} /></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No clients match your filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
