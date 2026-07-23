const BASE = "https://vexa-fazis-projects-f96b2d55.vercel.app";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
