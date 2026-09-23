import { ImageResponse } from "next/og";
import { ASCEND_BRAND, ascendChevronDataUri } from "@/lib/brand/ascend-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen / Apple touch icon — Ascend brand mark. */
export default function AppleIcon() {
  const chevron = ascendChevronDataUri("#fff", 96);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ASCEND_BRAND.gradient,
          borderRadius: 40,
        }}
      >
        {/* img required: ImageResponse has no next/image */}
        <img src={chevron} width={96} height={96} alt="" />
      </div>
    ),
    { ...size },
  );
}
