import type { Metadata } from "next";

import { dictionaries } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/locale";
import { buildMetadata } from "@/utils/build-metadata";
import { getProductDocuments } from "@/services/homepage";
import { FileText, Download, Package } from "lucide-react";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const dict = dictionaries[locale];
    return buildMetadata({
        path: "/tai-lieu-san-pham",
        locale,
        fallbackTitle: dict.product.documentsPageTitle,
        fallbackDescription: dict.product.documentsPageSubtitle,
    });
}

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
    const locale = await getLocale();
    const dict = dictionaries[locale];
    const isEn = locale === "en";

    const docs = await getProductDocuments().catch(() => []);

    return (
        <div className="content-container py-6 sm:py-10">
            <div className="max-w-[900px] mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {dict.product.documentsPageTitle}
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    {dict.product.documentsPageSubtitle}
                </p>

                {docs.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">
                        {isEn ? "No documents available yet." : "Chưa có tài liệu nào."}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {docs.map((doc: any) => {
                            const docName = isEn && doc.name_en ? doc.name_en : doc.name;
                            const docDesc = isEn && doc.description_en ? doc.description_en : doc.description;

                            return (
                                <div
                                    key={`${doc.productId}-${doc.id}`}
                                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    <div className="p-2.5 rounded-lg bg-red-50 text-red-600 flex-shrink-0 self-start">
                                        <FileText className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {docName}
                                            </span>
                                            <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                {doc.fileType}
                                            </span>
                                            <span className="text-[11px] text-gray-400">
                                                {doc.fileSize}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1.5">
                                            {docDesc}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {doc.productBrand && (
                                                <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {doc.productBrand}
                                                </span>
                                            )}
                                            <Link
                                                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                                href={isEn ? `/en/${doc.productHandle}` : `/${doc.productHandle}`}
                                            >
                                                <span className="flex items-center gap-1">
                                                    <Package className="h-3 w-3" />
                                                    {doc.productTitle}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>

                                    <a
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex-shrink-0"
                                        download
                                        href={doc.fileUrl}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span className="hidden sm:inline">{dict.product.download}</span>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
