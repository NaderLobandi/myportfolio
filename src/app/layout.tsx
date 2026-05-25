import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import PageViewTracker from "@/components/PageViewTracker";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://naderlobandi.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Nader Lobandi — ML Engineer & PhD Researcher",
    template: "%s | Nader Lobandi",
  },
  description:
    "Nader Lobandi (naderlobandi) — ML Engineer and PhD Researcher at the University of Denver. Deep learning, computer vision, and production AI systems. 4+ years industry experience, 4 IEEE publications.",
  keywords: [
    "Nader Lobandi",
    "naderlobandi",
    "nalo",
    "nalo996",
    "ML Engineer",
    "Machine Learning Engineer",
    "PhD Researcher",
    "University of Denver",
    "deep learning",
    "computer vision",
    "data scientist",
    "AI researcher",
    "LLM",
    "foundation models",
  ],
  authors: [{ name: "Nader Lobandi", url: BASE_URL }],
  creator: "Nader Lobandi",
  publisher: "Nader Lobandi",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "profile",
    firstName: "Nader",
    lastName: "Lobandi",
    username: "naderlobandi",
    url: BASE_URL,
    siteName: "Nader Lobandi",
    title: "Nader Lobandi — ML Engineer & PhD Researcher",
    description:
      "ML Engineer and PhD Researcher at the University of Denver. Building production AI systems in deep learning, computer vision, and LLMs.",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Nader Lobandi — ML Engineer & PhD Researcher",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@nalo996",
    creator: "@nalo996",
    title: "Nader Lobandi — ML Engineer & PhD Researcher",
    description:
      "ML Engineer and PhD Researcher at the University of Denver. Deep learning, computer vision, production AI systems.",
    images: ["/profile.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "google8e3d9c5a9359323a",
  },
};

// @graph links Person, WebSite, and ProfilePage so Google understands
// this domain is Nader Lobandi's authoritative profile page.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Nader Lobandi",
      alternateName: ["naderlobandi", "nalo", "nalo996"],
      url: BASE_URL,
      image: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#photo`,
        url: `${BASE_URL}/profile.jpg`,
        contentUrl: `${BASE_URL}/profile.jpg`,
        caption: "Nader Lobandi — ML Engineer & PhD Researcher",
      },
      jobTitle: "ML Engineer and PhD Researcher",
      description:
        "Nader Lobandi is an ML Engineer and PhD Researcher at the University of Denver specializing in deep learning, computer vision, and production AI systems. Author of 4 peer-reviewed IEEE publications.",
      hasOccupation: [
        { "@type": "Occupation", name: "Machine Learning Engineer" },
        { "@type": "Occupation", name: "PhD Researcher" },
      ],
      worksFor: {
        "@type": "EducationalOrganization",
        name: "University of Denver",
        url: "https://www.du.edu",
        department: "Ritchie School of Engineering & Computer Science",
      },
      alumniOf: [
        {
          "@type": "EducationalOrganization",
          name: "Northeastern University",
          department: "Khoury College of Computer Sciences",
        },
        {
          "@type": "EducationalOrganization",
          name: "Sharif University of Technology",
        },
      ],
      sameAs: [
        "https://www.linkedin.com/in/naderlobandi",
        "https://github.com/NaderLobandi",
        "https://scholar.google.com/citations?user=YZKf2ngAAAAJ&hl=en&oi=ao",
        "https://twitter.com/nalo996",
        "https://x.com/nalo996",
      ],
      email: "naderlobandi11@gmail.com",
      knowsAbout: [
        "Machine Learning",
        "Deep Learning",
        "Computer Vision",
        "Large Language Models",
        "Foundation Models",
        "PhD Research",
        "Data Science",
        "Python",
        "PyTorch",
        "TensorFlow",
        "Multimodal AI",
        "CUDA Programming",
        "GPU Computing",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Nader Lobandi",
      description:
        "Personal portfolio and research site of Nader Lobandi, ML Engineer and PhD Researcher.",
      publisher: { "@id": `${BASE_URL}/#person` },
      inLanguage: "en-US",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/website_logo.png`,
        width: 778,
        height: 778,
      },
    },
    {
      "@type": "ProfilePage",
      "@id": `${BASE_URL}/#profilepage`,
      url: BASE_URL,
      name: "Nader Lobandi — ML Engineer & PhD Researcher",
      description:
        "Nader Lobandi (naderlobandi) — ML Engineer and PhD Researcher at the University of Denver. Deep learning, computer vision, production AI systems. 4 IEEE publications.",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#person` },
      mainEntity: { "@id": `${BASE_URL}/#person` },
      dateCreated: "2025-08-01",
      dateModified: new Date().toISOString().slice(0, 10),
      inLanguage: "en-US",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Nader Lobandi",
            item: BASE_URL,
          },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <PageViewTracker />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
