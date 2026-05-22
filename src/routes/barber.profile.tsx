import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, X, Plus, Camera, GripVertical } from "lucide-react";
import { barbers, reviews } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { useWindowSize } from "@/hooks/use-window-size";

export const Route = createFileRoute("/barber/profile")({
  head: () => ({ meta: [{ title: "My Profile — Barber App" }] }),
  component: BarberProfile,
});

function BarberProfile() {
  const me = barbers[0];
  const [tags, setTags] = useState<string[]>(me.tags);
  const [draft, setDraft] = useState("");
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  if (isDesktop) {
    return (
      <PageShell>
        <div className="p-6 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Profile info form */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img src={me.avatar} alt="" className="w-20 h-20 rounded-full border-4 border-background" />
                <div>
                  <h1 className="text-2xl">{me.name}</h1>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="font-mono">{me.rating}</span>
                    <span>· {me.specialty}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Bio</label>
                  <textarea defaultValue={me.bio} className="mt-1 w-full min-h-[80px] bg-input border border-border rounded-md p-3 text-sm focus:border-primary focus:outline-none resize-none" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Specialties</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]" style={{ backgroundColor: "rgba(244,63,94,0.15)", color: "#F43F5E" }}>
                        {t}
                        <button onClick={() => setTags((p) => p.filter((x) => x !== t))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add..." className="h-7 px-2 rounded-full bg-input border border-border text-[11px] w-24 focus:border-primary focus:outline-none" />
                      <button onClick={() => { if (draft.trim()) { setTags((p) => [...p, draft.trim()]); setDraft(""); } }} className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Recent reviews</h2>
                  <div className="space-y-2">
                    {reviews.slice(0, 3).map((r) => (
                      <div key={r.id} className="bg-card border border-border rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-display text-sm">{r.client}</div>
                          <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Portfolio grid with reorder */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Portfolio</h2>
                <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground font-display text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3 h-3" />Add Photo
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {me.portfolio.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl border border-border relative overflow-hidden group cursor-pointer">
                    <img src={url} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <GripVertical className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 6 - me.portfolio.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-xl border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition">
                    <Camera className="w-6 h-6 text-muted-foreground opacity-30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // Mobile view
  return (
    <PageShell>
      <div className="relative h-32 bg-gradient-to-br from-primary/30 via-card to-background border-b border-border">
        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"><Camera className="w-4 h-4" /></button>
      </div>
      <div className="px-5 -mt-10 relative">
        <div className="flex items-end gap-3">
          <img src={me.avatar} alt="" className="w-20 h-20 rounded-full border-4 border-background" />
          <div className="pb-2">
            <h1 className="text-2xl">{me.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span className="font-mono">{me.rating}</span>
              <span>· {me.specialty}</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Bio</label>
          <textarea defaultValue={me.bio} className="mt-1 w-full min-h-[80px] bg-input border border-border rounded-md p-3 text-sm focus:border-primary focus:outline-none resize-none" />
        </div>

        <div className="mt-4">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Specialties</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]" style={{ backgroundColor: "rgba(244,63,94,0.15)", color: "#F43F5E" }}>
                {t}
                <button onClick={() => setTags((p) => p.filter((x) => x !== t))}><X className="w-3 h-3" /></button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add..." className="h-7 px-2 rounded-full bg-input border border-border text-[11px] w-24 focus:border-primary focus:outline-none" />
              <button onClick={() => { if (draft.trim()) { setTags((p) => [...p, draft.trim()]); setDraft(""); } }} className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Plus className="w-3 h-3" /></button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Portfolio</h2>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl border border-border relative overflow-hidden" style={{ background: `linear-gradient(${135 + i * 30}deg, #16161A, #27272A)` }}>
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Camera className="w-6 h-6 opacity-30" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Recent reviews</h2>
          <div className="space-y-2">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="font-display text-sm">{r.client}</div>
                  <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
