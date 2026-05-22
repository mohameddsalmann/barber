import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { clients, visitHistory } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { TierBadge } from "@/components/badges";

export const Route = createFileRoute("/dashboard/clients/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${clients.find((c) => c.id === params.id)?.name ?? "Client"} — Profile` }],
  }),
  loader: ({ params }) => {
    const c = clients.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return c;
  },
  component: ClientProfile,
});

function ClientProfile() {
  const c = Route.useLoaderData();

  return (
    <PageShell>
      <Link to="/dashboard/clients" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-3 h-3" /> Back to clients
      </Link>

      <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-5 flex-wrap">
        <img src={c.avatar} alt="" className="w-16 h-16 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl">{c.name}</h1>
            <TierBadge tier={c.tier} />
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {c.phone}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {c.email}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Visits</div>
            <div className="font-mono text-2xl">{c.visits}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">LTV</div>
            <div className="font-mono text-2xl text-primary">${c.ltv.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg mb-4">Visit History</h2>
          <div className="relative pl-5 border-l-2 border-primary/40 space-y-5">
            {visitHistory.map((v, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-card" />
                <div className="text-[11px] font-mono text-muted-foreground">{v.date}</div>
                <div className="font-display text-sm mt-0.5">{v.service} · ${v.spent}</div>
                <div className="text-[11px] text-muted-foreground">with {v.barber}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg mb-3">Notes & Preferences</h2>
          <textarea
            defaultValue={c.notes ?? ""}
            placeholder="Add preferences, allergies, or notes..."
            className="w-full min-h-[180px] bg-input border border-border rounded-md p-3 text-sm focus:border-primary focus:outline-none transition resize-none"
          />
          <button className="mt-3 w-full h-10 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider active:scale-[0.97]">Save Notes</button>
        </div>
      </div>
    </PageShell>
  );
}
