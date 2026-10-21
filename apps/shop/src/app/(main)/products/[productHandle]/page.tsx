import { getLocale } from "@/i18n/locale";
import { permanentRedirect } from "next/navigation";

export default async function OldProductPage({
    params,
}: {
    params: Promise<{ productHandle: string }>;
}) {
    const { productHandle } = await params;
    const locale = await getLocale();
    permanentRedirect(locale === "en" ? `/en/${productHandle}` : `/${productHandle}`);
}
