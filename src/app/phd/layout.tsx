import { Metadata } from "next";

const BASE_URL = "https://naderlobandi.com";

export const metadata: Metadata = {
  title: "PhD Journey",
  description:
    "Nader Lobandi's PhD research journey at the University of Denver — deep learning, computer vision, foundation models, milestones, and research areas.",
  alternates: {
    canonical: `${BASE_URL}/phd`,
  },
  openGraph: {
    title: "PhD Journey — Nader Lobandi",
    description:
      "Follow Nader Lobandi's PhD research at the University of Denver — deep learning, computer vision, multimodal foundation models, and research milestones.",
    url: `${BASE_URL}/phd`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE_URL}/phd#webpage`,
  url: `${BASE_URL}/phd`,
  name: "PhD Journey — Nader Lobandi",
  description:
    "Nader Lobandi's PhD research journey at the University of Denver — deep learning, computer vision, and foundation models.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  about: { "@id": `${BASE_URL}/#person` },
  inLanguage: "en-US",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Nader Lobandi", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "PhD Journey", item: `${BASE_URL}/phd` },
    ],
  },
};

export default function PhdLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
