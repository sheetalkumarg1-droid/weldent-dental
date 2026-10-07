import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar, WhatsAppButton } from "@/components/FloatingActions";
import { BookingProvider } from "@/components/BookingContext";
import { clinic } from "@/lib/site-core";
import { services } from "@/lib/services";
import { doctors } from "@/lib/site";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      {
        title: "Dental Clinic in Kalena Agrahara, Bengaluru | Weldent Dental",
      },
      {
        name: "description",
        content:
          "Dental clinic in Kalena Agrahara near Bannerghatta Road, Bengaluru. Book preventive, restorative and specialised dental care with Weldent Dental.",
      },
      { name: "author", content: clinic.businessName },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "geo.region", content: "IN-KA" },
      { name: "geo.placename", content: "Kalena Agrahara, Bengaluru" },
      { name: "theme-color", content: "#194c75" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: clinic.businessName },
      { property: "og:locale", content: "en_IN" },
      {
        property: "og:image",
        content: absoluteUrl("/images/weldent-social-preview.webp"),
      },
      { property: "og:image:type", content: "image/webp" },
      { property: "og:image:width", content: "2006" },
      { property: "og:image:height", content: "1254" },
      {
        property: "og:image:alt",
        content: "Weldent Multispeciality Dental Clinic logo",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: absoluteUrl("/images/weldent-social-preview.webp"),
      },
      { name: "twitter:image:alt", content: "Weldent Multispeciality Dental Clinic logo" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preload",
        href: "/fonts/plus-jakarta-sans-latin-400-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/plus-jakarta-sans-latin-600-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/cormorant-garamond-latin-300-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/cormorant-garamond-latin-300-italic.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "icon",
        href: "/favicon-48.png",
        type: "image/png",
        sizes: "48x48",
      },
      {
        rel: "icon",
        href: "/favicon-96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Weldent Dental Journal",
        href: absoluteUrl("/feed.xml"),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: `${SITE_URL}/`,
                  name: clinic.businessName,
                  alternateName: clinic.name,
                  inLanguage: "en-IN",
                  publisher: { "@id": `${SITE_URL}/#clinic` },
                },
                {
                  "@type": "Dentist",
                  "@id": `${SITE_URL}/#clinic`,
                  name: clinic.businessName,
                  alternateName: clinic.name,
                  description:
                    "Neighbourhood dental clinic in Kalena Agrahara near Bannerghatta Road, Bengaluru.",
                  url: SITE_URL,
                  image: [
                    absoluteUrl("/images/clinic-front-480.webp"),
                    absoluteUrl("/images/hero/clinic-2.webp"),
                    absoluteUrl("/images/hero/clinic-3.webp"),
                    absoluteUrl("/images/hero/clinic-4.webp"),
                    absoluteUrl("/images/hero/clinic-5.webp"),
                  ],
                  logo: absoluteUrl("/icon-512.png"),
                  telephone: clinic.phoneHref.replace("tel:", ""),
                  email: clinic.email,
                  currenciesAccepted: "INR",
                  knowsAbout: services.map((service) => service.title),
                  employee: doctors.map((doctor) => ({
                    "@type": "Person",
                    "@id": `${absoluteUrl(`/doctors/${doctor.slug}`)}#doctor`,
                    name: doctor.name,
                    jobTitle: doctor.role,
                    url: absoluteUrl(`/doctors/${doctor.slug}`),
                  })),
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: clinic.streetAddress,
                    addressLocality: clinic.addressLocality,
                    addressRegion: clinic.addressRegion,
                    postalCode: clinic.postalCode,
                    addressCountry: clinic.addressCountry,
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: clinic.latitude,
                    longitude: clinic.longitude,
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "appointments",
                    telephone: clinic.phoneHref.replace("tel:", ""),
                    email: clinic.email,
                    availableLanguage: "English",
                  },
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ],
                      opens: "10:30",
                      closes: "21:00",
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: "Sunday",
                      opens: "10:30",
                      closes: "15:30",
                    },
                  ],
                  sameAs: [clinic.instagram, clinic.mapUrl],
                  hasMap: clinic.mapUrl,
                  areaServed: [
                    { "@type": "Place", name: "Kalena Agrahara" },
                    { "@type": "Place", name: "Bannerghatta Road" },
                    { "@type": "City", name: "Bengaluru" },
                  ],
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Dental treatments",
                    itemListElement: services.map((service) => ({
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: service.title,
                        url: absoluteUrl(`/services/${service.slug}`),
                        provider: { "@id": `${SITE_URL}/#clinic` },
                      },
                    })),
                  },
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden md:block"
    >
      <div className="absolute -top-40 -left-32 size-[38rem] rounded-full bg-primary/25 blur-[120px] animate-float" />
      <div
        className="absolute top-1/3 -right-40 size-[34rem] rounded-full bg-accent/35 blur-[130px] animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 size-[30rem] rounded-full bg-rose/20 blur-[140px] animate-float"
        style={{ animationDelay: "-6s" }}
      />
    </div>
  );
}

function RootComponent() {
  return (
    <BookingProvider>
      <Aurora />
      <Header />
      <main className="site-main pt-24 md:pt-28">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
      <WhatsAppButton />
    </BookingProvider>
  );
}
