import { SHARE_SIZE, shareImage } from "@/lib/brand/share-image";

export const alt = "Ascend: learn how computers really work, from a single bit up";
export const size = SHARE_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return shareImage({
    title: "Learn how computers really work",
    line: "From a single bit to a shell you write yourself. Bits & Logic · Machine & Memory · The C Language · Systems.",
  });
}
