import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import staticIndexablePages from "./lib/indexable-pages.json";
import { clinic, doctors, posts, services } from "./lib/site";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type D1Result = {
  meta: {
    last_row_id?: number;
  };
};

type D1PreparedStatement = {
  bind: (...values: Array<string | null>) => D1PreparedStatement;
  run: () => Promise<D1Result>;
};

type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

type CloudflareEnv = {
  weldent: D1Database;
  INDEXNOW_KEY?: string;
};

type CloudflareRequest = Request & {
  runtime?: {
    cloudflare?: {
      env?: CloudflareEnv;
    };
  };
};

type Booking = {
  name: string;
  phone: string;
  email: string | null;
  treatment: string | null;
  doctor: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
};

const SITE_ORIGIN = "https://weldentdental.com";
const BUILD_ID = "seo-indexing-2026-09-17";
const maximumBookingBodyLength = 16_384;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let serverEntryPromise: Promise<ServerEntry> | undefined;

type IndexablePage = { path: string; lastModified: string };

function indexablePages(): IndexablePage[] {
  return [
    ...(staticIndexablePages as IndexablePage[]),
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      lastModified: service.dateModified,
    })),
    ...doctors.map((doctor) => ({
      path: `/doctors/${doctor.slug}`,
      lastModified: "2026-09-09",
    })),
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      lastModified: post.dateModified,
    })),
  ];
}

function jsonResponse(body: object, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
      ...headers,
    },
  });
}

function requiredString(value: unknown, minimum: number, maximum: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length >= minimum && normalized.length <= maximum ? normalized : null;
}

function optionalString(value: unknown, maximum: number): string | null | undefined {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  if (normalized.length > maximum) return undefined;
  return normalized || null;
}

function parseBooking(value: unknown): Booking | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const name = requiredString(input["name"], 2, 80);
  const phone = requiredString(input["phone"], 8, 20);
  const email = optionalString(input["email"], 160);
  const treatment = optionalString(input["treatment"], 80);
  const doctor = optionalString(input["doctor"], 80);
  const preferredDate = optionalString(input["preferred_date"], 20);
  const preferredTime = optionalString(input["preferred_time"], 40);
  const notes = optionalString(input["notes"], 600);

  if (
    !name ||
    !phone ||
    email === undefined ||
    (email !== null && !emailPattern.test(email)) ||
    treatment === undefined ||
    doctor === undefined ||
    preferredDate === undefined ||
    preferredTime === undefined ||
    notes === undefined
  ) {
    return null;
  }

  return {
    name,
    phone,
    email,
    treatment,
    doctor,
    preferred_date: preferredDate,
    preferred_time: preferredTime,
    notes,
  };
}

async function bookAppointment(request: Request, env: CloudflareEnv) {
  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405, { allow: "POST" });
  }

  if (request.headers.get("content-type")?.split(";", 1)[0]?.trim() !== "application/json") {
    return jsonResponse({ success: false, error: "A JSON request body is required" }, 400);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maximumBookingBodyLength) {
    return jsonResponse({ success: false, error: "Request body is too large" }, 400);
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (!body || body.length > maximumBookingBodyLength) {
      return jsonResponse({ success: false, error: "Invalid booking details" }, 400);
    }
    payload = JSON.parse(body);
  } catch {
    return jsonResponse({ success: false, error: "Invalid JSON request body" }, 400);
  }

  const booking = parseBooking(payload);
  if (!booking) {
    return jsonResponse({ success: false, error: "Invalid booking details" }, 400);
  }

  try {
    const result = await env.weldent
      .prepare(
        `INSERT INTO appointments (
          name,
          phone,
          email,
          treatment,
          doctor,
          preferred_date,
          preferred_time,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        booking.name,
        booking.phone,
        booking.email,
        booking.treatment,
        booking.doctor,
        booking.preferred_date,
        booking.preferred_time,
        booking.notes,
      )
      .run();

    const id = result.meta.last_row_id;
    if (typeof id !== "number") throw new Error("D1 insert completed without a row id");
    return jsonResponse({ success: true, id }, 201);
  } catch (error) {
    console.error("Failed to save appointment", error);
    return jsonResponse({ success: false, error: "Unable to save the appointment right now" }, 500);
  }
}

function getCloudflareEnv(request: Request, directEnv?: CloudflareEnv) {
  return directEnv ?? (request as CloudflareRequest).runtime?.cloudflare?.env;
}

function canonicalPathname(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

function seoResource(request: Request, indexNowKey?: string) {
  const url = new URL(request.url);
  const isPreview = url.hostname.endsWith(".workers.dev");

  if (url.pathname === "/robots.txt") {
    const rules = isPreview
      ? "User-agent: *\nDisallow: /"
      : [
          "User-agent: *",
          "Allow: /",
          "",
          "User-agent: OAI-SearchBot",
          "Allow: /",
          "",
          "User-agent: GPTBot",
          "Allow: /",
          "",
          "User-agent: ChatGPT-User",
          "Allow: /",
          "",
          "User-agent: ClaudeBot",
          "Allow: /",
          "",
          "User-agent: PerplexityBot",
          "Allow: /",
          "",
          "User-agent: Bingbot",
          "Allow: /",
        ].join("\n");
    return new Response(`${rules}\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  }

  if (!isPreview && indexNowKey && url.pathname === `/${indexNowKey}.txt`) {
    return new Response(`${indexNowKey}\n`, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=86400",
      },
    });
  }

  if (url.pathname === "/sitemap.xml") {
    const urls = indexablePages()
      .map(
        ({ path, lastModified }) =>
          `  <url><loc>${SITE_ORIGIN}${path}</loc><lastmod>${lastModified}</lastmod></url>`,
      )
      .join("\n");
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      {
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      },
    );
  }

  if (url.pathname === "/llms.txt") {
    const treatmentLinks = services
      .map(
        (service) =>
          `- [${service.title}](${SITE_ORIGIN}/services/${service.slug}): ${service.short}`,
      )
      .join("\n");
    const doctorLinks = doctors
      .map((doctor) => `- [${doctor.name}](${SITE_ORIGIN}/doctors/${doctor.slug}): ${doctor.role}`)
      .join("\n");
    return new Response(
      `# ${clinic.businessName}\n\n> ${clinic.tagline} Dental clinic in Kalena Agrahara, Bengaluru.\n\n## Verified clinic details\n\n- Address: ${clinic.address}\n- Phone: ${clinic.phone}\n- Email: ${clinic.email}\n- Hours: Monday-Saturday 10:30-21:00; Sunday 10:30-15:30\n- Canonical website: ${SITE_ORIGIN}/\n\n## Treatments\n\n${treatmentLinks}\n\n## Dental team\n\n${doctorLinks}\n\n## Important pages\n\n- [Book an appointment](${SITE_ORIGIN}/book)\n- [Before and after gallery](${SITE_ORIGIN}/gallery)\n- [Frequently asked questions](${SITE_ORIGIN}/faq)\n- [Dental journal](${SITE_ORIGIN}/blog)\n\nTreatment suitability, timelines and outcomes vary by patient and require a clinical examination.\n`,
      {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      },
    );
  }

  if (url.pathname === "/feed.xml") {
    const items = posts
      .map(
        (post) => `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${SITE_ORIGIN}/blog/${post.slug}</link>
    <guid isPermaLink="true">${SITE_ORIGIN}/blog/${post.slug}</guid>
    <description>${escapeXml(post.excerpt)}</description>
    <pubDate>${new Date(`${post.datePublished}T00:00:00Z`).toUTCString()}</pubDate>
  </item>`,
      )
      .join("\n");
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Weldent Dental Journal</title>
  <link>${SITE_ORIGIN}/blog</link>
  <description>Dentist-reviewed dental guidance from Weldent Dental in Bengaluru.</description>
  <language>en-IN</language>
${items}
</channel>
</rss>
`,
      {
        headers: {
          "content-type": "application/rss+xml; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      },
    );
  }

  return null;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function protectPreviewHostname(request: Request, response: Response) {
  if (!new URL(request.url).hostname.endsWith(".workers.dev")) return response;
  const headers = new Headers(response.headers);
  headers.set("x-robots-tag", "noindex, nofollow");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, directEnv?: CloudflareEnv, ctx?: unknown) {
    try {
      const requestUrl = new URL(request.url);
      const isCanonicalHostname =
        requestUrl.hostname === "weldentdental.com" ||
        requestUrl.hostname === "www.weldentdental.com";
      if (
        isCanonicalHostname &&
        (requestUrl.protocol !== "https:" || requestUrl.hostname === "www.weldentdental.com")
      ) {
        return Response.redirect(
          `${SITE_ORIGIN}${canonicalPathname(requestUrl.pathname)}${requestUrl.search}`,
          301,
        );
      }
      if (isCanonicalHostname && requestUrl.pathname !== "/" && requestUrl.pathname.endsWith("/")) {
        const normalizedPath = canonicalPathname(requestUrl.pathname);
        return Response.redirect(`${SITE_ORIGIN}${normalizedPath}${requestUrl.search}`, 301);
      }
      if (requestUrl.pathname === "/__health") {
        return jsonResponse({ status: "ok", build: BUILD_ID, canonicalOrigin: SITE_ORIGIN });
      }
      if (requestUrl.pathname === "/contact") {
        return Response.redirect(`${SITE_ORIGIN}/book${requestUrl.search}`, 301);
      }
      if (requestUrl.pathname === "/booking") {
        return Response.redirect(`${SITE_ORIGIN}/book${requestUrl.search}`, 301);
      }
      if (requestUrl.pathname === "/blog/aligners-vs-braces") {
        return Response.redirect(
          `${SITE_ORIGIN}/blog/braces-treatment-guide${requestUrl.search}`,
          301,
        );
      }
      const serviceRedirects: Record<string, string> = {
        "/services/emergency-dentist": "/services/check-ups",
        "/services/preventive-care": "/services/preventive-restorations",
        "/services/crown-bridge": "/services/crown-veneers-bridges",
        "/services/smile-correction": "/services/teeth-whitening-cosmetic",
        "/services/teeth-whitening": "/services/teeth-whitening-cosmetic",
        "/services/braces": "/services/braces-aligners",
        "/services/extractions": "/services/surgical-extraction",
        "/services/geriatric-dentistry": "/services/check-ups",
        "/services/gum-therapy": "/services/periodontal-gum-care",
      };
      const serviceRedirect = serviceRedirects[requestUrl.pathname];
      if (serviceRedirect) {
        return Response.redirect(`${SITE_ORIGIN}${serviceRedirect}${requestUrl.search}`, 301);
      }
      if (requestUrl.pathname === "/api/book") {
        const env = getCloudflareEnv(request, directEnv);
        if (!env?.weldent) {
          console.error("The weldent D1 binding is unavailable");
          return jsonResponse(
            { success: false, error: "Unable to save the appointment right now" },
            500,
          );
        }
        return bookAppointment(request, env);
      }
      const resource = seoResource(request, getCloudflareEnv(request, directEnv)?.INDEXNOW_KEY);
      if (resource) return resource;
      const handler = await getServerEntry();
      const response = await handler.fetch(request, directEnv, ctx);
      return protectPreviewHostname(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
