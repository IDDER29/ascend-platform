import { ImageResponse } from "next/og";
import { ASCEND_BRAND, ascendChevronDataUri } from "@/lib/brand/ascend-icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser tab / PWA icon — Ascend brand mark. */
export default function Icon() {
  const chevron = ascendChevronDataUri("#fff", 20);
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
          borderRadius: 8,
        }}
      >
        {/* img required: ImageResponse has no next/image */}
        <img src={chevron} width={20} height={20} alt="" />
      </div>
    ),
    { ...size },
  );
}
