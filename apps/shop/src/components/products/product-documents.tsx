"use client";

import { useLocale } from "@/i18n/locale-provider";
import { FileText, Download } from "lucide-react";

type ProductDocument = {
    id: number;
    name: string;
    name_en?: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
    description: string;
    description_en?: string;
};

type ProductDocumentsProps = {
    documents: ProductDocument[];
};

export default function ProductDocuments({ documents }: ProductDocumentsProps) {
    const { locale } = useLocale();
    const isEn = locale === "en";

    if (!documents?.length) return null;

    return (
        <div className="space-y-3">
            {documents.map((doc) => {
                const docName = isEn && doc.name_en ? doc.name_en : doc.name;
                const docDesc = isEn && doc.description_en ? doc.description_en : doc.description;

                return (
                    <a
                        key={doc.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                        href={doc.fileUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <div className="p-2 rounded-lg bg-red-50 text-red-600 flex-shrink-0">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors truncate">
                                    {docName}
                                </span>
                                <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                                    {doc.fileType}
                                </span>
                                <span className="text-[11px] text-gray-400 flex-shrink-0">
                                    {doc.fileSize}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {docDesc}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="hidden sm:inline text-xs text-gray-400 group-hover:text-red-600 transition-colors">
                                {isEn ? "Download" : "Tải về"}
                            </span>
                            <Download className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
