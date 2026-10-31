import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS } from "@/lib/content/schema";
import { CommandPalette, type PaletteLesson } from "@/components/command-palette";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { SITE_URL } from "@/lib/site/site-nav";
import { ASCEND_BRAND } from "@/lib/brand/ascend-icon";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DESCRIPTION =
  "A free, open-source, bottom-up computer-science curriculum. Bits, logic, the CPU, memory, C, and operating systems, from a single bit up.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages give just their own name ("Practice"); the template adds " · Ascend".
  title: { default: "Ascend · Learn how computers really work", template: "%s · Ascend" },
  description: DESCRIPTION,
  applicationName: "Ascend",
  // Listing icons here replaces Next's automatic tags, so every one is named: the SVG favicon first
  // (sharp, and lime in dark tab bars), the PNG from icon.tsx as a fallback, and apple-icon.tsx.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon/32", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180" }],
  },
  openGraph: { siteName: "Ascend", type: "website", locale: "en", description: DESCRIPTION },
  twitter: { card: "summary_large_image" },
};

/** The phone's browser bar takes the page colour, in light and dark. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: ASCEND_BRAND.bg },
    { media: "(prefers-color-scheme: dark)", color: ASCEND_BRAND.bgDark },
  ],
  colorScheme: "light dark",
};

// Deliberately NOT reading cookies()/the session here: doing so would opt
// the entire app into dynamic rendering. The session is only read in
// src/app/(learner)/layout.tsx, scoping that cost to learner chrome
// (curriculum, continue, practice, profile, …) so the homepage stays static.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paletteLessons: PaletteLesson[] = getAllLessons().map((lesson) => ({
    title: lesson.meta.title,
    href: lessonHref(lesson.meta.level, lesson.meta.slug),
    subtitle: `${LEVELS[lesson.meta.level].name} · ${lesson.meta.order}/${LEVELS[lesson.meta.level].totalConcepts}`,
  }));

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${bricolage.variable} ${hanken.variable} ${plexMono.variable} h-full overflow-x-hidden antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ascend-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');if(localStorage.getItem('ascend:sidebar-collapsed')==='true')document.documentElement.classList.add('sidebar-collapsed')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        {children}
        <CommandPalette lessons={paletteLessons} />
      </body>
    </html>
  );
}
