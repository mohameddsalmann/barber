/**
 * Localization utilities for the Egyptian market
 * Currency: EGP (Egyptian Pounds / ج.م)
 * Distance: Kilometers
 * Dates: Arabic-locale aware
 */

export function formatEGP(amount: number, locale: string = "en"): string {
  const formatted = amount.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
  return `${formatted} ج.م`;
}

export function formatNumber(n: number, locale: string = "en"): string {
  return n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
}

export function formatPercent(n: number, locale: string = "en"): string {
  return `${n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}%`;
}

export function formatDistanceKm(miles: number): string {
  const km = miles * 1.60934;
  return `${km.toFixed(1)} كم`;
}

export function formatDate(dateStr: string, locale: string = "en"): string {
  const date = new Date(dateStr);
  if (locale === "ar") {
    return new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTime(time: string, locale: string = "en"): string {
  const [h, m] = time.split(":").map(Number);
  if (locale === "ar") {
    const period = h >= 12 ? "م" : "ص";
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
  }
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatWaitMin(min: number, locale: string = "en"): string {
  if (locale === "ar") return `~${min} د`;
  return `~${min}m`;
}
