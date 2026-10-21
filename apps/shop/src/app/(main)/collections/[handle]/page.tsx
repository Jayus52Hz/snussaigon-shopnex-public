import { getLocale } from "@/i18n/locale";
import { permanentRedirect } from "next/navigation";
import slugRedirects from "@/data/slug-redirects.json";

// Route cũ /collections/{handle} → /snus-{handle}. Tra slug-redirects.json trước
// để đi thẳng tới đích cuối (tránh chuỗi 2 bước, vd odens → oden-s).
export default async function OldCollectionPage({
    params,
}: {
    params: Promise<{ handle: string }>;
}) {
    const { handle } = await params;
    const locale = await getLocale();
    const slug = `snus-${handle}`;
    const map = (slugRedirects as Record<string, Record<string, string>>)[locale];
    const fallback = locale === "en" ? `/en/${slug}` : `/${slug}`;
    permanentRedirect(map?.[slug] ?? fallback);
}
