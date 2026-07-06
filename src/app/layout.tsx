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
};

// Deliberately NOT reading cookies()/the session here: doing so would opt
// the entire app into dynamic rendering. The session is only read in
// src/app/(app)/layout.tsx, scoping that cost to the screens that actually
// display a signed-in user (dashboard, profile, settings, ...) so the
// homepage and all 24 lesson pages stay statically generated.
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
      className={`${bricolage.variable} ${hanken.variable} ${spaceMono.variable} h-full overflow-x-hidden antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans">
        {children}
        <CommandPalette lessons={paletteLessons} />
      </body>
    </html>
  );
}
