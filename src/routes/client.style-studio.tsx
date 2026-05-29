import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Heart, Sparkles, Wand2, Camera, Share2, Search, Scissors, Wheat, Crown, Grid3x3, Wind, type LucideIcon } from "lucide-react";
import { styleOptions } from "@/mock/data";
import type { StyleOption } from "@/mock/data";
import { PageShell } from "@/components/motion";
import { fileToBase64 } from "@/lib/image-utils";

export const Route = createFileRoute("/client/style-studio")({
  head: () => ({ meta: [{ title: "AI Style Studio — Client App" }] }),
  component: StyleStudio,
});

type Mode = "discover" | "tryon";
type Phase = "intro" | "loading" | "results" | "error";

const iconMap: Record<string, LucideIcon> = {
  Scissors,
  Wheat,
  Crown,
  Grid3x3,
  Wind,
};

function StyleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

function StyleStudio() {
  const [mode, setMode] = useState<Mode>("discover");

  return (
    <PageShell>
      <div className="px-5 pt-5">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />AI Style Studio
          </div>
          <h1 className="text-3xl mt-3 leading-tight">
            Find Your<br /><span className="gold-text">Perfect Cut</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-2 max-w-[280px] mx-auto">
            Upload a selfie. Our AI shows what suits your face — or test a specific style.
          </p>
        </div>

        <div className="mt-5 p-1 bg-card border border-border rounded-full grid grid-cols-2 gap-1">
          <button
            onClick={() => setMode("discover")}
            className="h-9 rounded-full font-display text-[10px] uppercase tracking-wider transition"
            style={{
              backgroundColor: mode === "discover" ? "#D4AF37" : "transparent",
              color: mode === "discover" ? "#0A0A0A" : "#A1A1AA",
            }}
          >
            Discover My Look
          </button>
          <button
            onClick={() => setMode("tryon")}
            className="h-9 rounded-full font-display text-[10px] uppercase tracking-wider transition"
            style={{
              backgroundColor: mode === "tryon" ? "#D4AF37" : "transparent",
              color: mode === "tryon" ? "#0A0A0A" : "#A1A1AA",
            }}
          >
            Try a Style
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "discover" ? (
            <motion.div key="discover" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DiscoverMode />
            </motion.div>
          ) : (
            <motion.div key="tryon" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TryOnMode />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

/* ── Shared Upload Component ── */
function UploadZone({
  photo,
  onPhotoSet,
  onBase64Ready,
  compact,
}: {
  photo: string | null;
  onPhotoSet: (url: string) => void;
  onBase64Ready?: (base64: string) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onPhotoSet(url);
      if (onBase64Ready) {
        const base64 = await fileToBase64(file);
        onBase64Ready(base64);
      }
    },
    [onPhotoSet, onBase64Ready],
  );

  if (photo) {
    return (
      <div className="relative group">
        <img src={photo} alt="Your photo" className={`w-full rounded-2xl object-cover ${compact ? "aspect-square" : "aspect-[3/4]"}`} />
        <button
          onClick={() => { onPhotoSet(""); if (inputRef.current) inputRef.current.value = ""; }}
          className="absolute top-2 right-2 h-8 px-3 rounded-full bg-black/70 backdrop-blur text-[10px] font-display uppercase tracking-wider flex items-center gap-1.5 text-primary"
        >
          <Camera className="w-3.5 h-3.5" />Retake
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => inputRef.current?.click()}
      className={`w-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary transition cursor-pointer ${compact ? "aspect-square" : "py-12"}`}
    >
      <Upload className="w-8 h-8 text-muted-foreground" />
      <div className="font-display text-sm">Upload your photo</div>
      <div className="text-[11px] text-muted-foreground">we'll find your best looks</div>
      <div className="text-[10px] text-muted-foreground mt-1">JPG, PNG, WebP</div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </button>
  );
}

/* ── MODE A: Discover My Look ── */
function DiscoverMode() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [photo, setPhoto] = useState<string | null>(null);
  const [base64Photo, setBase64Photo] = useState<string | null>(null);
  const [gridImageUrl, setGridImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const handlePhotoSet = useCallback((url: string) => {
    setPhoto(url || null);
    if (!url) setBase64Photo(null);
  }, []);

  const handleBase64Ready = useCallback((base64: string) => {
    setBase64Photo(base64);
  }, []);

  // Elapsed timer during loading
  useEffect(() => {
    if (phase !== "loading") return;
    setElapsed(0);
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  async function generate() {
    if (!base64Photo) return;
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/style-studio/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Photo }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { imageUrl } = await res.json();
      setGridImageUrl(imageUrl);
      setPhase("results");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPhase("error");
    }
  }

  if (phase === "intro") {
    return (
      <>
        <div className="mt-6">
          <UploadZone photo={photo} onPhotoSet={handlePhotoSet} onBase64Ready={handleBase64Ready} />
        </div>
        <button
          onClick={generate}
          disabled={!base64Photo}
          className="mt-6 w-full h-12 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />Discover My Best Styles →
        </button>
      </>
    );
  }

  if (phase === "loading") {
    return (
      <>
        <div className="mt-6 aspect-[3/4] skeleton rounded-2xl" />
        <div className="text-center mt-5 text-xs text-muted-foreground tracking-widest uppercase">
          AI is generating your styles… ({elapsed}s)
        </div>
      </>
    );
  }

  if (phase === "error") {
    return (
      <div className="mt-6 text-center">
        <div className="text-sm text-destructive mb-3">{error}</div>
        <button
          onClick={() => { setPhase("intro"); setError(null); }}
          className="w-full h-10 rounded-md border border-border text-xs font-display tracking-wider uppercase"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Results
  return (
    <div className="flex flex-col gap-4 mt-6">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <img
          src={gridImageUrl!}
          alt="Your hairstyle options"
          className="w-full rounded-2xl object-cover"
        />
      </motion.div>
      <div className="flex gap-3">
        <button
          onClick={() => { setPhase("intro"); setPhoto(null); setBase64Photo(null); setGridImageUrl(null); }}
          className="flex-1 h-11 rounded-md border border-border font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.97]"
        >
          Try Again
        </button>
        <button className="flex-1 h-11 rounded-md border border-border font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.97]">
          <Share2 className="w-4 h-4" />Share
        </button>
      </div>
    </div>
  );
}

/* ── MODE B: Try a Style ── */
function TryOnMode() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [photo, setPhoto] = useState<string | null>(null);
  const [base64Photo, setBase64Photo] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [resultConfidence, setResultConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const handlePhotoSet = useCallback((url: string) => {
    setPhoto(url || null);
    if (!url) setBase64Photo(null);
  }, []);

  const handleBase64Ready = useCallback((base64: string) => {
    setBase64Photo(base64);
  }, []);

  // Elapsed timer during loading
  useEffect(() => {
    if (phase !== "loading") return;
    setElapsed(0);
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const categories = ["All", "Fades", "Crops", "Classic", "Textured", "Long"] as const;
  const filteredStyles = styleOptions.filter((s) => {
    const matchesCat = activeCategory === "All" || s.category === activeCategory;
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const ready = base64Photo && selectedStyle;

  async function preview() {
    if (!base64Photo || !selectedStyle) return;
    setPhase("loading");
    setError(null);
    try {
      const res = await fetch("/api/style-studio/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Photo,
          styleName: selectedStyle.name,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { imageUrl, confidence } = await res.json();
      setResultImageUrl(imageUrl);
      setResultConfidence(confidence);
      setPhase("results");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPhase("error");
    }
  }

  if (phase === "intro") {
    return (
      <>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Your Photo</div>
            <UploadZone photo={photo} onPhotoSet={handlePhotoSet} onBase64Ready={handleBase64Ready} compact />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Choose a Style</div>
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles…"
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-card border border-border text-xs focus:border-primary focus:outline-none"
              />
            </div>
            {/* Category chips */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-none pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 px-3 py-1 rounded-full text-[10px] font-display tracking-wider border transition"
                  style={{
                    backgroundColor: activeCategory === cat ? "rgba(212,175,55,0.15)" : "transparent",
                    borderColor: activeCategory === cat ? "#D4AF37" : "#27272A",
                    color: activeCategory === cat ? "#D4AF37" : "#A1A1AA",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Style grid */}
            <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto scrollbar-none">
              {filteredStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border transition active:scale-[0.97]"
                  style={{
                    borderColor: selectedStyle?.id === s.id ? "#D4AF37" : "#27272A",
                    backgroundColor: selectedStyle?.id === s.id ? "rgba(212,175,55,0.08)" : "transparent",
                  }}
                >
                  <StyleIcon name={s.icon} className="w-5 h-5" />
                  <span className="text-[10px] font-display tracking-wider truncate" style={{ color: selectedStyle?.id === s.id ? "#D4AF37" : "#A1A1AA" }}>
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={preview}
          disabled={!ready}
          className="mt-6 w-full h-12 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" />Preview This Style →
        </button>
      </>
    );
  }

  if (phase === "loading") {
    return (
      <>
        <div className="mt-6 aspect-[3/4] skeleton rounded-2xl" />
        <div className="text-center mt-5 text-xs text-muted-foreground tracking-widest uppercase">
          Blending your photo with the style… ({elapsed}s)
        </div>
      </>
    );
  }

  if (phase === "error") {
    return (
      <div className="mt-6 text-center">
        <div className="text-sm text-destructive mb-3">{error}</div>
        <button
          onClick={() => { setPhase("intro"); setError(null); }}
          className="w-full h-10 rounded-md border border-border text-xs font-display tracking-wider uppercase"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Results
  return (
    <>
      <h2 className="text-sm uppercase tracking-wider text-muted-foreground mt-6 mb-3">Your try-on result</h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-2 gap-3"
      >
        {/* Original */}
        <div className="rounded-2xl border border-border overflow-hidden relative">
          {photo ? (
            <img src={photo} alt="Original" className="w-full aspect-[3/4] object-cover" />
          ) : (
            <div className="w-full aspect-[3/4] bg-card" />
          )}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] bg-black/70 backdrop-blur text-muted-foreground">
            Original
          </div>
        </div>
        {/* Styled */}
        <div className="rounded-2xl border border-primary/40 overflow-hidden relative">
          {resultImageUrl ? (
            <img src={resultImageUrl} alt={selectedStyle?.name ?? "Styled"} className="w-full aspect-[3/4] object-cover" />
          ) : (
            <div className="w-full aspect-[3/4] bg-card" />
          )}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] bg-black/70 backdrop-blur text-primary font-mono">
            {resultConfidence}% match
          </div>
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
            <div className="font-display text-sm">{selectedStyle?.name}</div>
            <div className="text-[10px] text-muted-foreground">Rendered on your face</div>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 h-11 rounded-md border border-border font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.97]">
          <Share2 className="w-4 h-4" />Share
        </button>
        <button className="flex-1 h-11 rounded-md border border-border font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.97]">
          <Heart className="w-4 h-4" />Save Look
        </button>
      </div>

      <button
        onClick={() => { setPhase("intro"); setPhoto(null); setBase64Photo(null); setSelectedStyle(null); setResultImageUrl(null); setResultConfidence(null); }}
        className="mt-2 w-full h-10 rounded-md border border-border text-xs font-display tracking-wider uppercase"
      >
        Try Another
      </button>
    </>
  );
}
