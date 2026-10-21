import Breadcrumbs from "@/components/breadcrumbs";

export default function PolicyTemplate({ policy }: { policy: any }) {
    const breadcrumbItems = [{ label: policy.title }];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="max-w-prose mx-auto py-12 px-4">
            <div className="flex flex-col gap-y-6 text-ui-fg-base">
                <div className="flex flex-col gap-y-4">
                    <h1 className="text-3xl font-bold mb-4">{policy.title}</h1>
                    {policy.description && (
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: policy.description }}
                            data-testid="policy-description"
                        />
                    )}
                </div>
            </div>
            </div>
        </>
    );
}
