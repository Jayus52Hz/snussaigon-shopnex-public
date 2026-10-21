import { getLocale } from "@/i18n/locale";
import { permanentRedirect } from "next/navigation";

export default async function OldStorePage() {
    const locale = await getLocale();
    permanentRedirect(locale === "en" ? "/en/snus" : "/snus");
}
