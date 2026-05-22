import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MessageCircle, Users, Award, Clock, Calendar } from "lucide-react";
import { getBarber, services } from "@/mock/data";
import { PageShell, Stagger, StaggerItem } from "@/components/motion";

export const Route = createFileRoute("/client/barbers/$id")({
  head: () => ({ meta: [{ title: "Barber Portfolio — Client App" }] }),
  component: BarberPortfolio,
});

const STATUS = {
  in:    { label: "Available", color: "#16A34A" },
  break: { label: "With Client", color: "#D97706" },
  out:   { label: "Off Today", color: "#71717A" },
} as const;

const DAY_LABELS: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

function BarberPortfolio() {
  const { id } = Route.useParams();
  const router = useRouter();
  const barber = getBarber(id);
  const status = STATUS[barber.status];

  return (
    <PageShell>
      {/* Hero */}
      <div className="relative h-40 bg-gradient-to-br from-primary/30 via-card to-background">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 30% 50%, rgba(212,175,55,0.15), transparent 60%)" }} />
        <button onClick={() => router.history.back()} className="absolute top-4 left-4 h-8 w-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 -mt-14 relative">
        {/* Avatar + Name */}
        <div className="flex items-end gap-4">
          <div className="relative">
            <img src={barber.avatar} alt="" className="w-24 h-24 rounded-full border-4 border-background" />
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-[3px] border-background" style={{ backgroundColor: status.color }} />
          </div>
          <div className="pb-2 flex-1 min-w-0">
            <h1 className="text-2xl leading-tight">{barber.name}</h1>
            <div className="text-[11px] text-muted-foreground">{barber.specialty}</div>
            <span
              className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-display tracking-wide"
              style={{ backgroundColor: `${status.color}26`, color: status.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
              {status.label}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{barber.bio}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {barber.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(244,63,94,0.15)", color: "#F43F5E" }}>{t}</span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          <Stat icon={Users} label="Clients" value={barber.totalClients.toString()} />
          <Stat icon={Star} label="Rating" value={barber.rating.toString()} />
          <Stat icon={Award} label="Years" value={barber.yearsExperience.toString()} />
          <Stat icon={Clock} label="Today" value={`${barber.todayCuts} cuts`} />
        </div>

        {/* Portfolio Gallery */}
        <h2 className="mt-7 mb-3 text-sm uppercase tracking-wider text-muted-foreground">Portfolio</h2>
        <Stagger className="grid grid-cols-3 gap-2">
          {barber.portfolio.map((url, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="aspect-square rounded-xl overflow-hidden relative"
              >
                <img src={url} alt={`Work ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Reviews */}
        <h2 className="mt-7 mb-3 text-sm uppercase tracking-wider text-muted-foreground">Client reviews</h2>
        <div className="space-y-2">
          {barber.barberReviews.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center gap-2">
                <img src={r.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-xs">{r.clientName}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{r.date}</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <h2 className="mt-7 mb-3 text-sm uppercase tracking-wider text-muted-foreground">Weekly schedule</h2>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-7 gap-1 text-center">
            {Object.entries(barber.weeklySchedule).map(([day, hours]) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{DAY_LABELS[day]}</div>
                <div className={`text-[10px] font-mono ${hours === "Off" ? "text-muted-foreground" : "text-foreground"}`}>
                  {hours === "Off" ? "—" : hours.split("–")[0].replace("am", "").replace("pm", "")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <h2 className="mt-7 mb-3 text-sm uppercase tracking-wider text-muted-foreground">Services</h2>
        <div className="grid grid-cols-2 gap-2">
          {services.slice(0, 4).map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-3">
              <div className="font-display text-sm">{s.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">{s.duration} min</span>
                <span className="font-mono text-primary text-sm">${s.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA — no booking */}
      <div className="sticky bottom-20 mt-8 px-5">
        <div className="flex gap-2">
          <button className="h-12 px-4 rounded-md border border-border flex items-center justify-center"><MessageCircle className="w-4 h-4 text-muted-foreground" /></button>
          <Link to="/client/barbers" className="flex-1">
            <button className="w-full h-12 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider active:scale-[0.97] flex items-center justify-center gap-2">
              View All Barbers
            </button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-center">
      <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
      <div className="font-display text-sm">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
