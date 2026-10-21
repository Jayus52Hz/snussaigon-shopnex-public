import { type NextRequest, NextResponse } from "next/server";

const CMS_API = `${process.env.CMS_INTERNAL_URL || "http://localhost:3000"}/api/orders/checkout`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const resp = await fetch(CMS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await resp.json();

        if (!resp.ok) {
            return NextResponse.json(
                { error: data.error || "Order creation failed" },
                { status: resp.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
