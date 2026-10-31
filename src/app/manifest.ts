import type { MetadataRoute } from "next";
import { ASCEND_BRAND } from "@/lib/brand/ascend-icon";

/** "Add to Home Screen": Ascend opens on Today, in its own window, in Coach colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ascend",
    short_name: "Ascend",
    description: "Learn how computers really work, from a single bit to a shell you write yourself.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: ASCEND_BRAND.bg,
    theme_color: ASCEND_BRAND.bg,
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
