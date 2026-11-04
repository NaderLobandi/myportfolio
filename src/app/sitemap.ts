import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://naderlobandi.com";
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/phd`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...['experience', 'education', 'projects', 'publications'].map((path) => ({
      url: `${base}/${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
