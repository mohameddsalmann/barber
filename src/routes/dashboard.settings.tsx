import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { teamMembers } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { Pill } from "@/components/badges";
import { Check } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Owner Dashboard" }] }),
  component: Settings,
});

const TABS = ["General", "Team", "Billing", "Notifications"] as const;
type Tab = typeof TABS[number];

function Settings() {
  const [tab, setTab] = useState<Tab>("General");
  const [notifs, setNotifs] = useState({
    email_booking: true, sms_booking: true, push_booking: false,
    email_review: true, sms_review: false, push_review: true,
    email_payment: false, sms_payment: false, push_payment: true,
  });

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your shop.</p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map((t) => <Pill key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Pill>)}
      </div>

      {tab === "General" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg mb-4">Shop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Shop name" defaultValue="Adham Gabriil — Art of Gents" />
              <Field label="Timezone" defaultValue="America/Los_Angeles" />
              <Field label="Phone" defaultValue="+1 (415) 555-0100" />
              <Field label="Address" defaultValue="220 Mission St, San Francisco" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg mb-4">Opening Hours</h2>
            <div className="space-y-2">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                <div key={d} className="flex items-center gap-3">
                  <div className="w-12 text-xs uppercase tracking-wider text-muted-foreground">{d}</div>
                  {i < 6 ? (
                    <>
                      <input defaultValue="09:00" className="w-24 h-9 rounded-md bg-input border border-border text-sm px-2 font-mono focus:border-primary focus:outline-none" />
                      <span className="text-muted-foreground">—</span>
                      <input defaultValue="19:00" className="w-24 h-9 rounded-md bg-input border border-border text-sm px-2 font-mono focus:border-primary focus:outline-none" />
                    </>
                  ) : <span className="text-muted-foreground text-sm">Closed</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Team" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-lg">Team Members</h2>
            <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider active:scale-[0.97]">Invite</button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3 text-left font-normal">Name</th><th className="px-5 py-3 text-left font-normal">Email</th><th className="px-5 py-3 text-left font-normal">Role</th></tr>
            </thead>
            <tbody>
              {teamMembers.map((m) => (
                <tr key={m.id} className="border-t border-border/60">
                  <td className="px-5 py-3 font-display">{m.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{m.email}</td>
                  <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-full text-[11px]" style={{ backgroundColor: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>{m.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Billing" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Starter", price: 49, features: ["1 location", "Up to 3 chairs", "Basic queue"], cur: false },
            { name: "Pro", price: 149, features: ["3 locations", "Unlimited chairs", "Live queue + POS", "Analytics"], cur: true },
            { name: "Enterprise", price: 399, features: ["Unlimited", "AI Style Studio", "Priority support", "API access"], cur: false },
          ].map((p) => (
            <div key={p.name} className="bg-card border rounded-2xl p-5" style={{ borderColor: p.cur ? "#D4AF37" : "#27272A" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl">{p.name}</h3>
                {p.cur && <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary text-primary-foreground font-display tracking-wider uppercase">Current</span>}
              </div>
              <div className="mt-3 font-mono"><span className="text-3xl">${p.price}</span><span className="text-muted-foreground text-sm">/mo</span></div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-muted-foreground"><Check className="w-3.5 h-3.5 text-primary" />{f}</li>
                ))}
              </ul>
              <button className="mt-5 w-full h-10 rounded-md font-display text-xs uppercase tracking-wider active:scale-[0.97]" style={{ backgroundColor: p.cur ? "transparent" : "#D4AF37", color: p.cur ? "#A1A1AA" : "#09090B", border: p.cur ? "1px solid #27272A" : "none" }}>{p.cur ? "Manage" : "Upgrade"}</button>
            </div>
          ))}
        </div>
      )}

      {tab === "Notifications" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3 text-left font-normal">Event</th><th className="px-5 py-3 font-normal">Email</th><th className="px-5 py-3 font-normal">SMS</th><th className="px-5 py-3 font-normal">Push</th></tr>
            </thead>
            <tbody>
              {[
                { id: "booking", label: "New booking" },
                { id: "review", label: "New review" },
                { id: "payment", label: "Payment received" },
              ].map((row) => (
                <tr key={row.id} className="border-t border-border/60">
                  <td className="px-5 py-3 font-display">{row.label}</td>
                  {(["email","sms","push"] as const).map((c) => {
                    const k = `${c}_${row.id}` as keyof typeof notifs;
                    return (
                      <td key={c} className="px-5 py-3 text-center">
                        <button onClick={() => setNotifs((p) => ({ ...p, [k]: !p[k] }))} className="w-10 h-6 rounded-full relative transition" style={{ backgroundColor: notifs[k] ? "#D4AF37" : "#27272A" }}>
                          <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ left: notifs[k] ? "18px" : "2px" }} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</label>
      <input defaultValue={defaultValue} className="mt-1 w-full h-10 px-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm transition" />
    </div>
  );
}
