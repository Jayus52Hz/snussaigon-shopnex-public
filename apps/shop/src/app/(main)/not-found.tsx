import type { Metadata } from "next";

import InteractiveLink from "@/components/interactive-link";

export const metadata: Metadata = {
    description: "Không tìm thấy trang",
    title: "404 - SnusSaigon",
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-500 mb-6">
                Không tìm thấy trang
            </p>
            <p className="text-gray-400 mb-8">
                Trang bạn truy cập không tồn tại hoặc đã bị di chuyển.
            </p>
            <InteractiveLink href="/">Về trang chủ</InteractiveLink>
        </div>
    );
}
