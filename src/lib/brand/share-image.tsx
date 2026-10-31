import { ImageResponse } from "next/og";
import { ASCEND_BRAND, ascendMarkDataUri } from "@/lib/brand/ascend-icon";

/** Link-preview images (Open Graph / X): 1200×630, ink, the mark and a title — one look for every page. */
export const SHARE_SIZE = { width: 1200, height: 630 };

export function shareImage({ eyebrow, title, line }: { eyebrow?: string; title: string; line?: string }) {
  const long = title.length > 48;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: ASCEND_BRAND.ink,
        color: "#f6f4ee",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* ImageResponse renders a plain <img>; next/image doesn't apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ascendMarkDataUri({ size: 72, tile: ASCEND_BRAND.lime, chevron: ASCEND_BRAND.ink })}
          width={72}
          height={72}
          alt=""
        />
        <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>Ascend</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {eyebrow ? <span style={{ fontSize: 30, color: ASCEND_BRAND.lime, fontWeight: 700 }}>{eyebrow}</span> : null}
        <span style={{ fontSize: long ? 64 : 80, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</span>
        {line ? <span style={{ fontSize: 30, color: ASCEND_BRAND.muted, lineHeight: 1.35 }}>{line}</span> : null}
      </div>
    </div>,
    SHARE_SIZE,
  );
}
