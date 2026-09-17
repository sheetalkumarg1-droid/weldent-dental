export const SITE_URL = "https://weldentdental.com";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).href;
}

export function canonicalPath(path = "/") {
  const url = new URL(path, SITE_URL);
  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  return pathname || "/";
}

export function canonicalLinks(path: string) {
  return [{ rel: "canonical", href: absoluteUrl(canonicalPath(path)) }];
}
