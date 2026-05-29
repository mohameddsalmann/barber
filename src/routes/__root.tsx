import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { CurrentBarberProvider } from "@/hooks/use-current-barber";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("error.pageNotFound")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("error.pageNotFoundDesc")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Adham Gabriil — The OS for Modern Barber Shops" },
      { name: "description", content: "Adham Gabriil is the operating system for modern barber shops. Live queue, bookings, POS, analytics, and AI style studio." },
      { property: "og:title", content: "Adham Gabriil — The OS for Modern Barber Shops" },
      { property: "og:description", content: "Adham Gabriil is the operating system for modern barber shops. Live queue, bookings, POS, analytics, and AI style studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Adham Gabriil — The OS for Modern Barber Shops" },
      { name: "twitter:description", content: "Adham Gabriil is the operating system for modern barber shops. Live queue, bookings, POS, analytics, and AI style studio." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b4d19420-a191-4f34-ad7d-0f2d31a8ab3f/id-preview-ca680c7d--840a3c64-197e-405a-aa02-c65946a7ce55.lovable.app-1777331533515.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b4d19420-a191-4f34-ad7d-0f2d31a8ab3f/id-preview-ca680c7d--840a3c64-197e-405a-aa02-c65946a7ce55.lovable.app-1777331533515.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { locale, dir } = useI18n();
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);
  return (
    <I18nProvider>
      <CurrentBarberProvider>
        <Outlet />
      </CurrentBarberProvider>
    </I18nProvider>
  );
}
