import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Scissors, User } from "lucide-react";
import { logoUrl } from "@/mock/data";
import { Stagger, StaggerItem } from "@/components/motion";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adham Gabriil — Choose Your Experience" },
      { name: "description", content: "Owner, Barber, or Client — choose how you'll experience the operating system for modern barber shops." },
    ],
  }),
  component: Index,
});

const roles = [
  {
    titleKey: "landing.ownerTitle",
    descKey: "landing.ownerDesc",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "landing.barberTitle",
    descKey: "landing.barberDesc",
    href: "/barber",
    icon: Scissors,
  },
  {
    titleKey: "landing.clientTitle",
    descKey: "landing.clientDesc",
    href: "/client",
    icon: User,
  },
];

function Index() {
  const { t, locale, setLocale, dir } = useI18n();
  return (
    <div className="min-h-screen bg-background relative overflow-hidden" dir={dir}>
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.12), transparent 60%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="absolute right-6 top-6">
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="h-8 px-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition flex items-center gap-1.5 text-xs font-display"
            aria-label={locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
          >
            {locale === "ar" ? "EN" : "ع"}
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <img
            src={logoUrl}
            alt="Adham Gabriil — Art of Gents"
            className="w-44 h-44 md:w-56 md:h-56 object-cover rounded-2xl border border-border shadow-2xl"
          />
          <h1 className="mt-8 text-4xl md:text-6xl font-display tracking-tight">
            <span className="gold-text">Adham Gabriil</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground tracking-[0.2em] uppercase">
            {t("landing.tagline")}
          </p>
          <p className="mt-8 text-lg md:text-2xl text-foreground/90 max-w-2xl font-normal">
            {t("landing.description")}
          </p>
        </motion.div>

        <Stagger className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((r) => (
            <StaggerItem key={r.href}>
              <Link to={r.href}>
                <motion.div
                  whileHover={{ scale: 1.015, borderColor: "#D4AF37" }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.15 }}
                  className="group relative bg-card border border-border rounded-2xl p-6 h-full cursor-pointer overflow-hidden"
                >
                  <div
                    aria-hidden
                    className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.18), transparent 70%)",
                    }}
                  />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                      <r.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-display">{t(r.titleKey)}</h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(r.descKey)}</p>
                    <div className="mt-6 inline-flex items-center text-xs font-display tracking-wider text-primary">
                      {t("landing.enter")}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-16 text-center text-xs text-muted-foreground tracking-widest uppercase">
          {t("landing.investorDemo")}
        </div>
      </div>
    </div>
  );
}
