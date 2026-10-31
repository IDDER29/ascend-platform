import { ImageResponse } from "next/og";
import { ascendMarkDataUri } from "@/lib/brand/ascend-icon";

export const contentType = "image/png";

/** PNG app icons: 32 for tabs that don't take the SVG favicon, 192 and 512 for the web app manifest. */
export function generateImageMetadata() {
  return [32, 192, 512].map((px) => ({ id: String(px), size: { width: px, height: px }, contentType }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const px = Number(await id) || 32;
  return new ImageResponse(
    // img required: ImageResponse has no next/image
    <img src={ascendMarkDataUri({ size: px })} width={px} height={px} alt="" />,
    { width: px, height: px },
  );
}
