import type { Metadata } from "next";

import { ArrowUpRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";
import Link from "next/link";

export const metadata: Metadata = {
    description: "Không tìm thấy trang",
    title: "404 - SnusSaigon",
};

export default function NotFound() {
    return (
        <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
            <h1 className="text-2xl-semi text-ui-fg-base">Không tìm thấy trang</h1>
            <p className="text-small-regular text-ui-fg-base">
                Trang bạn truy cập không tồn tại.
            </p>
            <Link className="flex gap-x-1 items-center group" href="/">
                <Text className="text-ui-fg-interactive">Về trang chủ</Text>
                <ArrowUpRightMini
                    className="group-hover:rotate-45 ease-in-out duration-150"
                    color="var(--fg-interactive)"
                />
            </Link>
        </div>
    );
}
