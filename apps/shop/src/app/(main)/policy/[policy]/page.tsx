import type { Metadata } from "next";
import PolicyTemplate from "@/templates/policy";
import { payloadSdk } from "@/utils/payload-sdk";
import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import { notFound } from "next/navigation";

type PolicyPageProps = {
    params: Promise<{ policy: string }>;
};

export async function generateMetadata(props: PolicyPageProps): Promise<Metadata> {
    const params = await props.params;
    const locale = await getLocale();
    const result = await payloadSdk.find({
        collection: "policies",
        limit: 1,
        locale: locale as any,
        where: { handle: { equals: params.policy } },
    }).catch(() => ({ docs: [] }));
    const policy = result.docs[0];
    const title = policy?.title ? `${policy.title} | SnusSaigon` : "Chính sách | SnusSaigon";
    // buildMetadata để og:url/og:locale đúng trang (không kế thừa og:url trang chủ)
    return buildMetadata({
        path: `/policy/${params.policy}`,
        locale,
        fallbackTitle: title,
        fallbackDescription: policy?.title || title,
    });
}

export default async function PolicyPage(props: PolicyPageProps) {
    const params = await props.params;
    const locale = await getLocale();

    const policyResult = await payloadSdk.find({
        collection: "policies",
        limit: 1,
        locale: locale as any,   // ← truyền locale đúng: 'vi' hoặc 'en'
        fallbackLocale: "vi" as any, // ← fallback về VI nếu EN chưa có nội dung
        where: {
            handle: {
                equals: params.policy,
            },
        },
    });

    const policy = policyResult.docs[0];

    if (!policy) {
        notFound();
    }

    return <PolicyTemplate policy={policy} />;
}
