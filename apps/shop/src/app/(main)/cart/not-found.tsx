import type { Metadata } from "next";

import InteractiveLink from "@/components/interactive-link";

export const metadata: Metadata = {
    description: "Không tìm thấy giỏ hàng",
    title: "404 - SnusSaigon",
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
            <h1 className="text-2xl-semi text-ui-fg-base">Không tìm thấy giỏ hàng</h1>
            <p className="text-small-regular text-ui-fg-base">
                Giỏ hàng bạn truy cập không tồn tại. Vui lòng xóa cookies và
                thử lại.
            </p>
            <InteractiveLink href="/">Về trang chủ</InteractiveLink>
        </div>
    );
}
