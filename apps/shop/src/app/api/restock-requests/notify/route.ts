import { type NextRequest, NextResponse } from "next/server";

// Production: nginx chuyển /api thẳng vào CMS, route này chỉ dùng khi chạy local.
const CMS_API = `${process.env.CMS_INTERNAL_URL || "http://localhost:3000"}/api/restock-requests/notify`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // Giữ IP khách cho rate limit phía CMS
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

        const resp = await fetch(CMS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(ip ? { "x-forwarded-for": ip } : {}) },
            body: JSON.stringify(body),
        });

        const data = await resp.json().catch(() => ({}));
        return NextResponse.json(data, { status: resp.status });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
