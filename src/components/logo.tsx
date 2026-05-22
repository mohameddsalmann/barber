import { logoUrl } from "@/mock/data";
import { cn } from "@/lib/utils";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logoUrl}
        alt="Adham Gabriil"
        style={{ height: size, width: size }}
        className="object-cover rounded-md"
      />
      <div className="flex flex-col leading-none">
        <span className="font-display text-[15px] tracking-wide gold-text">ADHAM GABRIIL</span>
        <span className="text-[9px] tracking-[0.25em] text-muted-foreground mt-0.5">ART OF GENTS</span>
      </div>
    </div>
  );
}
