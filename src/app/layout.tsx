import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS } from "@/lib/content/schema";
import { CommandPalette, type PaletteLesson } from "@/components/command-palette";

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

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Ascend — Learn how computers really work",
  description:
    "A free, open-source, bottom-up computer-science curriculum. Bits, logic, the CPU, memory, C, and operating systems — from a single bit up.",
  applicationName: "Ascend",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
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
    href: `/curriculum/${lesson.meta.level}/${lesson.meta.slug}`,
    subtitle: `${LEVELS[lesson.meta.level].name} · ${lesson.meta.order}/${LEVELS[lesson.meta.level].totalConcepts}`,
  }));

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${hanken.variable} ${spaceMono.variable} h-full overflow-x-hidden antialiased`}
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
