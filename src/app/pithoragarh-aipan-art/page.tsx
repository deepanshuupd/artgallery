import { permanentRedirect } from "next/navigation";

export const dynamic = "force-static";

export default function LegacyAipanArtPage() {
  permanentRedirect("/aipan-art");
}
