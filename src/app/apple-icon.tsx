import { ImageResponse } from "next/og";
import { ascendMarkDataUri } from "@/lib/brand/ascend-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon: full-bleed ink (iOS rounds the corners itself), chevrons inside the safe area. */
export default function AppleIcon() {
  return new ImageResponse(
    <img src={ascendMarkDataUri({ size: 180, radius: 0, scale: 0.5 })} width={180} height={180} alt="" />,
    { ...size },
  );
}
