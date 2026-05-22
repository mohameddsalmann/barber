import type { BookingStatus, LoyaltyTier } from "@/mock/data";
import { statusBadge, tierBadge } from "@/mock/data";

export function StatusBadge({ status }: { status: BookingStatus }) {
  const s = statusBadge[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-display tracking-wide"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export function TierBadge({ tier }: { tier: LoyaltyTier }) {
  const t = tierBadge[tier];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-display tracking-wide"
      style={{ backgroundColor: `${t.color}26`, color: t.color }}
    >
      {t.label}
    </span>
  );
}

export function Pill({
  children,
  active,
  onClick,
  color = "#D4AF37",
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-display tracking-wide transition-all border active:scale-[0.97]"
      style={{
        backgroundColor: active ? `${color}26` : "transparent",
        borderColor: active ? color : "#27272A",
        color: active ? color : "#A1A1AA",
      }}
    >
      {children}
    </button>
  );
}
