import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Check } from "lucide-react";
import { services, products, barbers } from "@/mock/data";
import { formatEGP } from "@/lib/format";
import { useI18n, getServiceName, getProductName } from "@/lib/i18n";
import { PageShell } from "@/components/motion";

export const Route = createFileRoute("/dashboard/pos")({
  head: () => ({ meta: [{ title: "POS Terminal — Owner Dashboard" }] }),
  component: POS,
});

type CartItem = { id: string; name: string; price: number; qty: number };

function POS() {
  const { t, locale } = useI18n();
  useEffect(() => { document.title = t("route.dashboard.posTitle"); }, [t]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tip, setTip] = useState<number>(15);
  const [discount, setDiscount] = useState<number>(0);
  const [barberId, setBarberId] = useState<string>(barbers[0].id);
  const [success, setSuccess] = useState<null | string>(null);

  const add = (item: { id: string; name: string; price: number }) => {
    setCart((p) => {
      const ex = p.find((i) => i.id === item.id);
      if (ex) return p.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...p, { ...item, qty: 1 }];
    });
  };
  const dec = (id: string) => setCart((p) => p.flatMap((i) => i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]));

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const disc = subtotal * (discount / 100);
  const tipVal = (subtotal - disc) * (tip / 100);
  const total = subtotal - disc + tipVal;

  const pay = (method: string) => {
    if (cart.length === 0) return;
    setSuccess(method);
    setTimeout(() => {
      setSuccess(null);
      setCart([]);
      setTip(15);
      setDiscount(0);
    }, 2200);
  };

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl">{t("pos.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("pos.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-5">
          <div>
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">{t("pos.services")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {services.map((s) => (
                <motion.button
                  key={s.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => add(s)}
                  className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary transition"
                >
                  <div className="font-display text-base">{getServiceName(s.name, t)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.duration} {t("common.min")}</div>
                  <div className="font-mono text-lg text-primary mt-2">{formatEGP(s.price, locale)}</div>
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">{t("pos.products")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {products.map((p) => (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => add(p)}
                  className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary transition"
                >
                  <div className="font-display text-sm">{getProductName(p.name, t)}</div>
                  <div className="font-mono text-base text-primary mt-2">{formatEGP(p.price, locale)}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-20">
            <h2 className="text-lg mb-4">{t("pos.order")}</h2>
            <div className="min-h-[140px] max-h-[280px] overflow-y-auto space-y-2">
              {cart.length === 0 && <div className="text-xs text-muted-foreground py-8 text-center">{t("pos.cartEmpty")}</div>}
              {cart.map((i) => (
                <div key={i.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/40">
                  <div className="flex-1">
                    <div className="font-display text-sm">{getServiceName(i.name, t)}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{formatEGP(i.price, locale)} × {i.qty}</div>
                  </div>
                  <button onClick={() => dec(i.id)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:border-primary"><Minus className="w-3 h-3" /></button>
                  <button onClick={() => add(i)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:border-primary"><Plus className="w-3 h-3" /></button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{t("pos.tip")}</div>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 20].map((pct) => (
                    <button key={pct} onClick={() => setTip(pct)} className="h-9 rounded-md text-xs font-display border" style={{ borderColor: tip === pct ? "#D4AF37" : "#27272A", backgroundColor: tip === pct ? "rgba(212,175,55,0.15)" : "transparent", color: tip === pct ? "#D4AF37" : "#A1A1AA" }}>{pct}%</button>
                  ))}
                  <input type="number" value={tip} onChange={(e) => setTip(Number(e.target.value) || 0)} className="h-9 rounded-md bg-input border border-border text-xs px-2 text-center font-mono" />
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{t("pos.discount")}</div>
                <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} className="w-full h-9 rounded-md bg-input border border-border text-xs px-3 font-mono focus:border-primary focus:outline-none" />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{t("pos.assignTo")}</div>
                <select value={barberId} onChange={(e) => setBarberId(e.target.value)} className="w-full h-9 rounded-md bg-input border border-border text-sm px-3">
                  {barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-1.5 font-mono text-sm">
              <Row label={t("pos.subtotal")} v={subtotal} locale={locale} />
              <Row label={t("pos.discount")} v={-disc} locale={locale} />
              <Row label={`${t("pos.tip")} (${tip}%)`} v={tipVal} locale={locale} />
              <div className="flex justify-between pt-2 border-t border-border mt-2">
                <span className="font-display text-base">{t("pos.total")}</span>
                <span className="font-display text-2xl text-primary">{formatEGP(Math.round(total), locale)}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button onClick={() => pay(t("pos.cash"))} className="h-11 rounded-md font-display text-xs uppercase tracking-wider active:scale-[0.97]" style={{ backgroundColor: "#16A34A", color: "white" }}>{t("pos.cash")}</button>
              <button onClick={() => pay(t("pos.card"))} className="h-11 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider active:scale-[0.97]">{t("pos.card")}</button>
              <button onClick={() => pay(t("pos.vodafoneCash"))} className="h-11 rounded-md font-display text-xs uppercase tracking-wider active:scale-[0.97]" style={{ backgroundColor: "#F43F5E", color: "white" }}>{t("pos.vodafoneCash")}</button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 mx-auto flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-2xl mt-5">{t("pos.paymentReceived")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{success} · {formatEGP(Math.round(total), locale)}</p>
              <div className="mt-5 text-[11px] text-muted-foreground tracking-widest uppercase">{t("pos.receiptSent")}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function Row({ label, v, locale = "en" }: { label: string; v: number; locale?: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{formatEGP(Math.abs(Math.round(v)), locale)}</span>
    </div>
  );
}
